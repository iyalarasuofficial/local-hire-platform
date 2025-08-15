import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Edit, Camera, Save, X, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import type { RootState } from '../../store/store';
import { updateUserProfile } from '../../store/authSlice';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import Loader from '../common/Loader';
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  sendEmailVerification,
  reload
} from 'firebase/auth';

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth);
  const uid = user.uid;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [dataFetching, setDataFetching] = useState(false);

  useEffect(() => {
    if (uid && !hasFetched) {
      setHasFetched(true);
      fetchData();
    }
  }, [uid, hasFetched]);

  const fetchData = async () => {
    try {
      setProfileLoading(true);
      setDataFetching(true);
      const toastId = toast.loading('Loading profile data...');
      const res = await axiosInstance.get(`${ApiRoutes.GET_USER_PROFILE.path}/${uid}`);
      setUserData({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        profilePic: res.data.profilePic || ''
      });
      toast.dismiss(toastId);
    } catch {
      toast.error('Failed to load profile data.');
    } finally {
      setProfileLoading(false);
      setDataFetching(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      profilePic: userData.profilePic || ''
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({});
    setShowPasswordModal(false);
    setCurrentPassword('');
    toast.dismiss();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        } else if (height > maxWidth) {
          width = (width * maxWidth) / height;
          height = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        if (!ctx) {
          resolve('');
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImageUploading(true);
        const uploadToast = toast.loading('Processing image...');
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file', { id: uploadToast });
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error('Image size must be less than 10MB', { id: uploadToast });
          return;
        }
        const compressedBase64 = await compressImage(file, 800, 0.7);
        setEditForm(prev => ({ ...prev, profilePic: compressedBase64 }));
        toast.success('Profile picture updated!', { id: uploadToast });
      } catch {
        toast.error('Failed to process image.');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!editForm.name?.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!editForm.email?.trim()) {
      toast.error('Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (editForm.email !== user.email) {
      setShowPasswordModal(true);
      return;
    }

    await saveProfile();
  };

  const handleEmailUpdate = async () => {
    if (!currentPassword.trim()) {
      toast.error('Please enter your current password');
      return;
    }
    if (currentPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    const updateToast = toast.loading('Updating email address...');

    try {
      const auth = getAuth();
      const user_auth = auth.currentUser;

      if (!user_auth) {
        throw new Error('No authenticated user found');
      }

      const credential = EmailAuthProvider.credential(user_auth.email!, currentPassword);
      await reauthenticateWithCredential(user_auth, credential);

      await updateEmail(user_auth, editForm.email);

      await reload(user_auth);

      await sendEmailVerification(user_auth);

      await saveProfile(updateToast, 'Email updated successfully! Please verify your new email address.');

      setShowPasswordModal(false);
      setCurrentPassword('');

    } catch (error: any) {
      let errorMessage = 'Failed to update email.';
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Current password is incorrect';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use by another account';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'For security reasons, please log out and log back in before changing your email';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User account not found. Please log in again.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials provided';
          break;
        default:
          errorMessage = `Update failed: ${error.message}`;
      }
      toast.error(errorMessage, { id: updateToast });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (toastId = null, successMsg = 'Profile updated successfully!') => {
    try {
      if (!toastId) toastId = toast.loading('Saving profile changes...');
      const response = await axiosInstance.put(
        `${ApiRoutes.UPDATE_USER_PROFILE.path}/${uid}`,
        {
          name: editForm.name?.trim(),
          email: editForm.email?.trim(),
          phone: editForm.phone?.trim(),
          address: editForm.address?.trim(),
          profilePic: editForm.profilePic
        }
      );
      if (response.status === 200) {
        dispatch(
          updateUserProfile({
            name: editForm.name?.trim(),
            email: editForm.email?.trim(),
            profilePic: editForm.profilePic
          })
        );
        setUserData(prev => ({
          ...prev,
          ...editForm
        }));
        closeEditModal();
        toast.success(successMsg, { id: toastId });
      }
    } catch {
      toast.error('Failed to update profile.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {loading && <Loader />}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={userData.profilePic || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData.name || 'User'}</h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <User className="w-4 h-4 mr-1" />
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={openEditModal}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
              <span>{loading ? 'Processing...' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{userData.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">{userData.address || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-800 font-mono text-sm">{user.uid}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && !showPasswordModal && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
                <button
                  onClick={closeEditModal}
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <img
                      src={
                        editForm.profilePic ||
                        userData.profilePic ||
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
                      }
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
                    />
                    <label className={`absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {imageUploading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        disabled={imageUploading || loading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    {imageUploading ? 'Processing image...' : 'Click camera to change picture'}
                  </p>
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {editForm.email !== userData.email && (
                    <p className="text-xs text-yellow-600 mt-1">
                      ⚠️ Changing email will require password verification
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={editForm.address || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    rows={3}
                    placeholder="Enter your address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex justify-end space-x-3 p-6 border-t">
                  <button
                    onClick={closeEditModal}
                    disabled={loading}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading || imageUploading}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Confirmation Modal for Email Update */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Confirm Password</h3>
                <button
                  onClick={closeEditModal}
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    To update your email address, please enter your current password for security verification.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      <strong>Email change:</strong> {userData.email} → {editForm.email}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your current password"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  disabled={loading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailUpdate}
                  disabled={loading || !currentPassword.trim() || currentPassword.length < 6}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;

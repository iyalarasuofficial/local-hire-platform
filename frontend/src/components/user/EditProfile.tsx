import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Edit, Camera, Save, X, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import type { RootState } from '../../store/store';
import { updateUserProfile } from '../../store/authSlice';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth);
  const uid = user.uid;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    profilePic?: string;
  }>({});
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    profilePic?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [dataFetching, setDataFetching] = useState(false);

  useEffect(() => {
    if (uid) {
      fetchData();
    }
  }, [uid]);

  const fetchData = async () => {
    try {
      setProfileLoading(true);
      setDataFetching(true);
      
      // Show loading toast for long operations
      const loadingToast = toast.loading('Loading profile data...');

      const response = await axiosInstance.get(`${ApiRoutes.GET_USER_PROFILE.path}/${uid}`);

      setUserData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        profilePic: response.data.profilePic || ''
      });

      toast.success('Profile loaded successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data. Please try again.');
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
    toast.success('Edit mode activated');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({});
    setShowPasswordModal(false);
    setCurrentPassword('');
    toast.dismiss(); // Clear any existing toasts
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
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

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file', { id: uploadToast });
          return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast.error('Image size must be less than 10MB', { id: uploadToast });
          return;
        }

        // Check file size and show info
        const fileSizeMB = file.size / (1024 * 1024);
        console.log(`Original file size: ${fileSizeMB.toFixed(2)} MB`);
        
        // Compress the image
        const compressedBase64 = await compressImage(file, 800, 0.7);
        
        // Check compressed size
        const compressedSizeKB = (compressedBase64.length * 0.75) / 1024;
        console.log(`Compressed size: ${compressedSizeKB.toFixed(2)} KB`);
        
        setEditForm(prev => ({
          ...prev,
          profilePic: compressedBase64
        }));

        toast.success(`Image processed! Compressed to ${compressedSizeKB.toFixed(0)}KB`, { id: uploadToast });
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.error('Failed to process image. Please try again.');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleSave = async () => {
    // Validation
    if (!editForm.name?.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!editForm.email?.trim()) {
      toast.error('Email is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (editForm.email !== user.email) {
      toast.info('Email change detected - password verification required');
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
      const { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail } =
        await import('firebase/auth');
      const auth = getAuth();
      const user_auth = auth.currentUser;

      if (!user_auth) {
        throw new Error('No authenticated user found');
      }

      // Step 1: Re-authenticate
      toast.loading('Verifying password...', { id: updateToast });
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user_auth, credential);

      // Step 2: Update email
      toast.loading('Updating email address...', { id: updateToast });
      await updateEmail(user_auth, editForm.email!);

      // Step 3: Send verification email
      if (user_auth) {
        toast.loading('Sending verification email...', { id: updateToast });
        await user_auth.sendEmailVerification();
      }

      // Step 4: Save profile
      toast.loading('Saving profile changes...', { id: updateToast });
      await saveProfile();

      toast.success('Email updated successfully! Please check your inbox for verification.', { id: updateToast });
      setShowPasswordModal(false);
      setCurrentPassword('');
    } catch (error: any) {
      console.error('Error updating email:', error);

      let errorMessage = 'Failed to update email. Please try again.';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use by another account';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log back in before changing your email';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }

      toast.error(errorMessage, { id: updateToast });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    const saveToast = toast.loading('Saving profile changes...');

    try {
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
        // Update Redux store
        dispatch(
          updateUserProfile({
            name: editForm.name?.trim(),
            email: editForm.email?.trim(),
            profilePic: editForm.profilePic
          })
        );

        // Update local state
        setUserData(prev => ({
          ...prev,
          ...editForm,
          name: editForm.name?.trim(),
          email: editForm.email?.trim(),
          phone: editForm.phone?.trim(),
          address: editForm.address?.trim()
        }));

        closeEditModal();
        toast.success('Profile updated successfully!', { 
          id: saveToast,
          duration: 4000,
          icon: '✅'
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your input.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      toast.error(errorMessage, { id: saveToast });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading profile...</p>
          {dataFetching && (
            <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={
                    userData.profilePic ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
                  }
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
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Edit className="w-4 h-4" />
              )}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
        )}

        {/* Password Confirmation Modal for Email Update */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
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
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
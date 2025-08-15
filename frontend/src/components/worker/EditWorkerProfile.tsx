import React, { useState, useEffect } from 'react';
import { 
  User, MapPin, Phone, Mail, Edit, Camera, Save, X, Loader2, 
  Wrench, DollarSign, Clock, Star, Navigation, Plus, 
  ToggleLeft, ToggleRight, FileText
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import type { RootState } from '../../store/store';
import { updateUserProfile } from '../../store/authSlice';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../common/Loader';
import WorkerApiRoutes from '../../api/workerApiRoutes';
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  sendEmailVerification,
  onAuthStateChanged ,
  reload
} from 'firebase/auth';

const EditWorkerProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth);
  const uid = user.uid;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [workerData, setWorkerData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [dataFetching, setDataFetching] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Predefined skills for suggestions
  const suggestedSkills = [
    'plumbing', 'electrical', 'carpentry', 'painting', 'cleaning',
    'gardening', 'handyman', 'appliance repair', 'hvac', 'roofing',
    'flooring', 'tiling', 'welding', 'masonry', 'locksmith'
  ];
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (uid && !hasFetched) {
      setHasFetched(true);
      fetchData();
    }
  }, [uid, hasFetched]);

   useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      setProfileLoading(true);
      setDataFetching(true);
      const toastId = toast.loading('Loading profile data...');
      const res = await axiosInstance.get(`${WorkerApiRoutes.GET_WORKER_PROFILE.path}/${uid}`);
      const data = res.data;
      setWorkerData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        profilePic: data.profilePic || '',
        skills: data.skills || [],
        bio: data.bio || '',
        experience: data.experience || 0,
        charge: data.charge || 0,
        isAvailable: data.isAvailable || true,
        maxDistance: data.maxDistance || 20,
        location: data.location || { coordinates: [0, 0] },
        averageRating: data.averageRating || 0,
        totalRatings: data.totalRatings || 0
      });
      toast.dismiss(toastId);
    } catch (error) {
      toast.error('Failed to load profile data.');
    } finally {
      setProfileLoading(false);
      setDataFetching(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      name: workerData.name || '',
      email: workerData.email || '',
      phone: workerData.phone || '',
      address: workerData.address || '',
      profilePic: workerData.profilePic || '',
      skills: [...(workerData.skills || [])],
      bio: workerData.bio || '',
      experience: workerData.experience || 0,
      charge: workerData.charge || 0,
      isAvailable: workerData.isAvailable || true,
      maxDistance: workerData.maxDistance || 20,
      location: workerData.location || { coordinates: [0, 0] }
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({});
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewSkill('');
    toast.dismiss();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setEditForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setEditForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !editForm.skills?.includes(newSkill.trim().toLowerCase())) {
      setEditForm(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim().toLowerCase()]
      }));
      setNewSkill('');
    } else if (editForm.skills?.includes(newSkill.trim().toLowerCase())) {
      toast.error('Skill already added');
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  const addSuggestedSkill = (skill) => {
    if (!editForm.skills?.includes(skill)) {
      setEditForm(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill]
      }));
    }
  };

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
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
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleProfilePicChange = async (e) => {
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
      } catch (error) {
        toast.error('Failed to process image.');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!editForm.name?.trim()) return toast.error('Name is required');
    if (!editForm.email?.trim()) return toast.error('Email is required');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) return toast.error('Please enter a valid email address');
    if (editForm.charge < 0) return toast.error('Charge cannot be negative');
    if (editForm.experience < 0) return toast.error('Experience cannot be negative');
    if (editForm.maxDistance < 1 || editForm.maxDistance > 100) return toast.error('Max distance must be between 1-100 km');
    
    if (editForm.email !== user.email) {
      setShowPasswordModal(true);
      return;
    }
    await saveProfile();
  };

const handleEmailUpdate = async () => {
  if (!currentPassword.trim()) {
    return toast.error('Please enter your current password');
  }
  if (currentPassword.length < 6) {
    return toast.error('Password must be at least 6 characters long');
  }

  if (!currentUser) {
    return toast.error('No authenticated user found. Please log in.');
  }

  setLoading(true);
  const updateToast = toast.loading('Updating email address...');

  try {
    console.log('Current user email:', currentUser.email);
    console.log('New email:', editForm.email);

    // Step 1: Re-authenticate
    const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);

    // Step 2: Update email
    await updateEmail(currentUser, editForm.email);

    // Step 3: Reload user to get latest state
    await reload(currentUser);

    // Step 4: Send verification email
    await sendEmailVerification(currentUser);

    // Step 5: Update backend
    await saveProfile(updateToast, 'Email updated successfully! Please verify your new email address.');

    setShowPasswordModal(false);
    setCurrentPassword('');
  } catch (error: any) {
    console.error('Email update error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

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
        `${WorkerApiRoutes.UPDATE_WORKER_PROFILE.path}/${uid}`,
        {
          name: editForm.name?.trim(),
          email: editForm.email?.trim(),
          phone: editForm.phone?.trim(),
          address: editForm.address?.trim(),
          profilePic: editForm.profilePic,
          skills: editForm.skills || [],
          bio: editForm.bio?.trim(),
          experience: editForm.experience || 0,
          charge: editForm.charge || 0,
          isAvailable: editForm.isAvailable,
          maxDistance: editForm.maxDistance || 20,
          location: editForm.location
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
        setWorkerData(prev => ({
          ...prev,
          ...editForm
        }));
        closeEditModal();
        toast.success(successMsg, { id: toastId });
      }
    } catch (error) {
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
        {loading && <Loader/>}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={
                    workerData.profilePic ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                  workerData.isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{workerData.name || 'Worker'}</h1>
                <div className="flex items-center mt-1 space-x-4">
                  <p className="text-gray-600 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {user.role}
                  </p>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="text-sm font-medium">
                      {workerData.averageRating?.toFixed(1) || '0.0'} ({workerData.totalRatings || 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    workerData.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {workerData.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
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
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{workerData.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{workerData.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">{workerData.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Worker ID</p>
                  <p className="font-medium text-gray-800 font-mono text-sm">{user.uid}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Professional Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium text-gray-800">{workerData.experience || 0} years</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Hourly Charge</p>
                  <p className="font-medium text-gray-800">₹{workerData.charge || 0}/hour</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Navigation className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Service Radius</p>
                  <p className="font-medium text-gray-800">{workerData.maxDistance || 20} km</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-medium text-gray-800">
                    {workerData.averageRating?.toFixed(1) || '0.0'}/5.0 ({workerData.totalRatings || 0} reviews)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills and Bio */}
        <div className="mt-6 space-y-6">
          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {workerData.skills?.length > 0 ? (
                workerData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    <Wrench className="w-3 h-3 mr-1" />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed">
              {workerData.bio || 'No bio provided yet.'}
            </p>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && !showPasswordModal && (
          <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Edit Worker Profile</h3>
                <button
                  onClick={closeEditModal}
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <img
                      src={
                        editForm.profilePic ||
                        workerData.profilePic ||
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

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Basic Information</h4>
                    
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
                      {editForm.email !== workerData.email && (
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

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Professional Information</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience (years) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={editForm.experience || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                        min="0"
                        max="50"
                        placeholder="Enter years of experience"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hourly Charge (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="charge"
                        value={editForm.charge || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                        min="0"
                        step="50"
                        placeholder="Enter hourly charge"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Radius (km) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="maxDistance"
                        value={editForm.maxDistance || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                        min="1"
                        max="100"
                        placeholder="Maximum distance you can travel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Availability Status
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleInputChange({
                            target: { name: 'isAvailable', type: 'checkbox', checked: !editForm.isAvailable }
                          })}
                          disabled={loading}
                          className="flex items-center space-x-2"
                        >
                          {editForm.isAvailable ? (
                            <ToggleRight className="w-8 h-8 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-400" />
                          )}
                          <span className={`font-medium ${editForm.isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                            {editForm.isAvailable ? 'Available for work' : 'Not available'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Skills</h4>
                  
                  {/* Add New Skill */}
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a new skill"
                      disabled={loading}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      disabled={loading || !newSkill.trim()}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Current Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editForm.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 group"
                      >
                        <Wrench className="w-3 h-3 mr-1" />
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          disabled={loading}
                          className="ml-2 text-green-600 hover:text-red-600 disabled:opacity-50"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Suggested Skills */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Suggested Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills
                        .filter(skill => !editForm.skills?.includes(skill))
                        .slice(0, 8)
                        .map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSuggestedSkill(skill)}
                            disabled={loading}
                            className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            + {skill}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="w-4 h-4 inline mr-1" />
                    About Me / Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    rows={4}
                    placeholder="Tell potential clients about yourself, your experience, and what makes you unique..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editForm.bio?.length || 0}/500 characters
                  </p>
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
          <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                      <strong>Email change:</strong> {workerData.email} → {editForm.email}
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

export default EditWorkerProfile;
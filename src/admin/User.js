import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Add, 
  Close, 
  VerifiedUser, 
  Person, 
  EditNote,
  Refresh
} from '@mui/icons-material';
import { useConfirm } from 'material-ui-confirm';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import RoleChip from '../components/RoleChip';
import UserAvatar from '../components/UserAvatar';
import './Users.css';

// Role options with permissions
const ROLE_OPTIONS = [
  { value: 'user', label: 'User', description: 'Basic access' },
  { value: 'editor', label: 'Editor', description: 'Can create and edit content' },
  { value: 'admin', label: 'Admin', description: 'Full administrative privileges' }
];

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Users = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '',
    severity: 'success' 
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confirm = useConfirm();

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${currentAdmin.token}`
        }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      handleApiError(err, 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle API errors consistently
  const handleApiError = (err, defaultMessage) => {
    const errorMessage = err.response?.data?.message || 
                        err.message || 
                        defaultMessage;
    setError(errorMessage);
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: 'error'
    });
    console.error('API Error:', err);
  };

  // Handle form input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!currentUser && !formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password && !PASSWORD_REGEX.test(formData.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number and special character';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle dialog open for creating/editing user
  const handleDialogOpen = (user = null) => {
    setCurrentUser(user);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'user',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  // Submit user form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = { 
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      // Only include password if it's set (for new users or password changes)
      if (formData.password) {
        payload.password = formData.password;
      }

      if (currentUser) {
        // Update existing user
        await axios.put(`/api/admin/users/${currentUser._id}`, payload, {
          headers: {
            'Authorization': `Bearer ${currentAdmin.token}`
          }
        });
        setSnackbar({ 
          open: true, 
          message: 'User updated successfully',
          severity: 'success'
        });
      } else {
        // Create new user
        await axios.post('/api/admin/users', payload, {
          headers: {
            'Authorization': `Bearer ${currentAdmin.token}`
          }
        });
        setSnackbar({ 
          open: true, 
          message: 'User created successfully',
          severity: 'success'
        });
      }
      fetchUsers();
      setOpenDialog(false);
    } catch (err) {
      handleApiError(err, currentUser ? 'Failed to update user' : 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle user deletion with confirmation
  const handleDelete = async (user) => {
    try {
      await confirm({
        title: 'Confirm Delete',
        description: `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
        confirmationText: 'Delete',
        confirmationButtonProps: { variant: 'contained', color: 'error' }
      });

      await axios.delete(`/api/admin/users/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${currentAdmin.token}`
        }
      });
      
      setSnackbar({ 
        open: true, 
        message: 'User deleted successfully',
        severity: 'success'
      });
      fetchUsers();
    } catch (err) {
      if (err !== 'cancel') {
        handleApiError(err, 'Failed to delete user');
      }
    }
  };

  // Handle password reset
  const handleResetPassword = async (userId) => {
    try {
      await confirm({
        title: 'Reset Password',
        description: 'This will generate a temporary password for the user. Are you sure?',
        confirmationText: 'Reset',
        confirmationButtonProps: { variant: 'contained', color: 'warning' }
      });

      const response = await axios.post(`/api/admin/users/${userId}/reset-password`, {}, {
        headers: {
          'Authorization': `Bearer ${currentAdmin.token}`
        }
      });
      
      setSnackbar({ 
        open: true, 
        message: `Password reset successful. Temporary password: ${response.data.tempPassword}`,
        severity: 'info',
        autoHideDuration: 10000
      });
    } catch (err) {
      if (err !== 'cancel') {
        handleApiError(err, 'Failed to reset password');
      }
    }
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="users-admin-container">
      <div className="users-header">
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <div className="users-actions">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleDialogOpen()}
          >
            Add User
          </Button>
          <Tooltip title="Refresh users">
            <IconButton onClick={fetchUsers}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="error-container">
          <Typography color="error">{error}</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={fetchUsers}
            startIcon={<Refresh />}
          >
            Retry
          </Button>
        </div>
      ) : (
        <TableContainer component={Paper} className="users-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <div className="user-cell">
                      <UserAvatar user={user} />
                      <div className="user-info">
                        <Typography variant="body1">{user.name}</Typography>
                        {user._id === currentAdmin._id && (
                          <Chip 
                            size="small" 
                            label="You" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleChip role={user.role} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Chip 
                        icon={<VerifiedUser fontSize="small" />} 
                        label="Verified" 
                        size="small" 
                        color="success" 
                        variant="outlined"
                      />
                    ) : (
                      <Chip 
                        icon={<Person fontSize="small" />} 
                        label="Pending" 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div className="action-buttons">
                      <Tooltip title="Edit user">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleDialogOpen(user)}
                          disabled={user._id === currentAdmin._id}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reset password">
                        <IconButton 
                          color="secondary"
                          onClick={() => handleResetPassword(user._id)}
                        >
                          <EditNote />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete user">
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(user)}
                          disabled={user._id === currentAdmin._id}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => !isSubmitting && setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              margin="normal"
              name="name"
              label="Full Name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
              disabled={isSubmitting}
            />
            
            <TextField
              margin="normal"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
              disabled={isSubmitting || !!currentUser}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Role"
                required
                disabled={isSubmitting}
              >
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem 
                    key={option.value} 
                    value={option.value}
                  >
                    <div className="role-option">
                      <span>{option.label}</span>
                      <Typography variant="caption" color="textSecondary">
                        {option.description}
                      </Typography>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {!currentUser && (
              <>
                <TextField
                  margin="normal"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password || 'Min 8 chars with uppercase, lowercase, number and special char'}
                  required
                  disabled={isSubmitting}
                />
                
                <TextField
                  margin="normal"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  required
                  disabled={isSubmitting}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenDialog(false)} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} style={{ marginRight: 8 }} />
                  {currentUser ? 'Updating...' : 'Creating...'}
                </>
              ) : currentUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration || 6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <div className={`snackbar-content ${snackbar.severity}`}>
          <Typography>{snackbar.message}</Typography>
          <IconButton
            size="small"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </div>
      </Snackbar>
    </div>
  );
};

export default Users;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { settingsService, Settings } from '../services/settingsService';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await settingsService.updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCompanyChange = (field: string, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      company: {
        ...settings.company,
        [field]: value,
      },
    });
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value,
      },
    });
  };

  const handleInventoryChange = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      inventory: {
        ...settings.inventory,
        [field]: value,
      },
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Alert severity="error">Failed to load settings</Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          System Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      {/* Company Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Company Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={settings.company.name}
              onChange={(e) => handleCompanyChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={settings.company.email}
              onChange={(e) => handleCompanyChange('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              value={settings.company.phone}
              onChange={(e) => handleCompanyChange('phone', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tax Code"
              value={settings.company.taxCode || ''}
              onChange={(e) => handleCompanyChange('taxCode', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={settings.company.address}
              onChange={(e) => handleCompanyChange('address', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website"
              value={settings.company.website || ''}
              onChange={(e) => handleCompanyChange('website', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Notification Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                />
              }
              label="Email Notifications"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                />
              }
              label="SMS Notifications"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.lowStockAlerts}
                  onChange={(e) => handleNotificationChange('lowStockAlerts', e.target.checked)}
                />
              }
              label="Low Stock Alerts"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.orderStatusUpdates}
                  onChange={(e) => handleNotificationChange('orderStatusUpdates', e.target.checked)}
                />
              }
              label="Order Status Updates"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.systemAlerts}
                  onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
                />
              }
              label="System Alerts"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Inventory Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Inventory Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.inventory.autoReorder}
                  onChange={(e) => handleInventoryChange('autoReorder', e.target.checked)}
                />
              }
              label="Auto Reorder"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Reorder Threshold (%)"
              type="number"
              value={settings.inventory.reorderThreshold}
              onChange={(e) => handleInventoryChange('reorderThreshold', parseInt(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Default Warehouse"
              value={settings.inventory.defaultWarehouse}
              onChange={(e) => handleInventoryChange('defaultWarehouse', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Stock Count Frequency"
              value={settings.inventory.stockCountFrequency}
              onChange={(e) => handleInventoryChange('stockCountFrequency', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.inventory.enableBarcodeScanning}
                  onChange={(e) => handleInventoryChange('enableBarcodeScanning', e.target.checked)}
                />
              }
              label="Enable Barcode Scanning"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.inventory.requireSerialNumbers}
                  onChange={(e) => handleInventoryChange('requireSerialNumbers', e.target.checked)}
                />
              }
              label="Require Serial Numbers"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

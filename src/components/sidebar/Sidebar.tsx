// Sidebar.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme } from '@mui/material';
import { FaSms, FaChartLine, FaAddressBook, FaPhone, FaRegCalendarAlt, FaLink, FaChartBar, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SMSList from './SmsList';
import SMSAnalytics from './SMSAnalytics';
import CallLogDashboard from './CallLogDashboard';
import AnalyticsGraph from './AnalyticsGraph';
import Contacts from './Contacts';
import Canalytics from './Canalytics';
import CallLog from './CallLog';
import TimelineAnalysis from './TimelineAnalysis';
import UrlAnalysis from './UrlAnalysis';
import DataCorrelation from './DataCorrealtion';

function Sidebar() {
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const [showReportsPopup, setShowReportsPopup] = useState(false);
  const [showReportsPopupS, setShowReportsPopupS] = useState(false);
  const [showReportsPopupSCA, setShowReportsPopupSCA] = useState(false);
  const [showReportsPopupSCOA, setShowReportsPopupSCOA] = useState(false);
  const [showReportsPopupTime, setShowReportsPopupTime] = useState(false);
  const [showReportsPopupURL, setShowReportsPopupURL] = useState(false);
  const [showReportsPopupData, setShowReportsPopupData] = useState(false);



  const [showMainitemPopup, setShowMainitemPopup] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: isMobile ? '100%' : 250,
        position: isMobile ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        bgcolor: '#ffffff',
        boxShadow: theme.shadows[3],
        p: 2,
        borderRadius: 1,
        transition: 'width 0.3s ease',
        overflowY: 'auto',
      }}
    >
      {/* SMS Section */}
      <Box sx={{ mt:3, border: '1px solid #ddd', p: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          SMS
        </Typography>
        <Button
          startIcon={<FaSms />}
          fullWidth
          sx={{ justifyContent: 'flex-start', mb: 1, textTransform: 'none', fontWeight: 'medium' }}
          onClick={() => setShowPurchasePopup(true)}
        >
          All
        </Button>
        <Button
          startIcon={<FaChartLine />}
          fullWidth
          sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 'medium' }}
          onClick={() => setShowReportsPopup(true)}
        >
          Analytics
        </Button>
      </Box>

      {/* Contacts Section */}
      <Box sx={{  border: '1px solid #ddd', p: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          Contacts
        </Typography>
        <Button
          startIcon={<FaAddressBook />}
          fullWidth
          sx={{ justifyContent: 'flex-start', mb: 1, textTransform: 'none', fontWeight: 'medium' }}
          onClick={() => setShowMainitemPopup(true)}
        >
          All
        </Button>
        <Button
          startIcon={<FaChartLine />}
          fullWidth
          sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 'medium' }}
          onClick={() => setShowReportsPopupSCOA(true)}
        >
          Analytics
        </Button>
      </Box>

      {/* Call Log Section */}
      <Box sx={{ mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          Call Log
        </Typography>
        <Button
          startIcon={<FaPhone />}
          fullWidth
          sx={{ justifyContent: 'flex-start', mb: 1, textTransform: 'none', fontWeight: 'medium' }}
          onClick={() => setShowReportsPopupS(true)}
        >
          All
        </Button>
        <Button
          startIcon={<FaChartLine />}
          fullWidth
          sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 'medium' }}
          onClick={() => setShowReportsPopupSCA(true)}
        >
          Analytics
        </Button>
      </Box>

      {/* Others Section */}
      <Box sx={{  border: '1px solid #ddd', p: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          Others
        </Typography>
        <Button
          startIcon={<FaRegCalendarAlt />}
          fullWidth
          sx={{ justifyContent: 'flex-start', mb: 1, textTransform: 'none', fontWeight: 'medium' }}
          onClick={() => setShowReportsPopupTime(true)}
        >
          Timeline Analysis
        </Button>
        <Button
          startIcon={<FaLink />}
          fullWidth
          sx={{ justifyContent: 'flex-start', mb: 1, textTransform: 'none', fontWeight: 'medium' }}
          onClick={() => setShowReportsPopupURL(true)}
        >
          URL Analysis
        </Button>
        <Button
          startIcon={<FaChartBar />}
          fullWidth
          sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 'medium' }}
          onClick={() => setShowReportsPopupData(true)}
        >
          Data Correlation
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="caption" color="textSecondary">
          © 2024 Developed By Rana Faheem ,Yasir Arfat and Ali raza. All rights reserved.
        </Typography>
      </Box>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="colored" />

      {/* Dialogs */}
      <Dialog open={showPurchasePopup} onClose={() => setShowPurchasePopup(false)}>
        <DialogTitle>
          SMS Details
          <IconButton
            aria-label="close"
            onClick={() => setShowPurchasePopup(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <SMSList />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPurchasePopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showReportsPopup} onClose={() => setShowReportsPopup(false)}>
        <DialogTitle>
          SMS Report
          <IconButton
            aria-label="close"
            onClick={() => setShowReportsPopup(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <SMSAnalytics />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportsPopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showMainitemPopup} onClose={() => setShowMainitemPopup(false)}>
        <DialogTitle>
          Contacts
          <IconButton
            aria-label="close"
            onClick={() => setShowMainitemPopup(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Contacts />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMainitemPopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showReportsPopupSCA} onClose={() => setShowReportsPopupSCA(false)}>
        <DialogTitle>
          Call Log Analytics
          <IconButton
            aria-label="close"
            onClick={() => setShowReportsPopupSCA(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AnalyticsGraph />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportsPopupSCA(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showReportsPopupS} onClose={() => setShowReportsPopupS(false)}>
        <DialogTitle>
          Call Log Dashboard
          <IconButton
            aria-label="close"
            onClick={() => setShowReportsPopupS(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CallLog/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportsPopupS(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showReportsPopupSCOA} onClose={() => setShowReportsPopupSCOA(false)}>
        <DialogTitle>
          Contact Analytics
          <IconButton
            aria-label="close"
            onClick={() => setShowReportsPopupSCOA(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Canalytics />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportsPopupSCOA(false)}>Close</Button>
        </DialogActions>
      </Dialog>



      <Dialog open={showReportsPopupTime} onClose={() => setShowReportsPopupTime(false)}>
        <DialogTitle>
          Timeline Analysis
          <IconButton
            aria-label="close"
            onClick={() => setShowReportsPopupTime(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TimelineAnalysis/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportsPopupTime(false)}>Close</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={showReportsPopupURL} onClose={() => setShowReportsPopupURL(false)}>
        <DialogTitle>
          URL Analysis
          <IconButton
            aria-label="close"
            onClick={() => setShowReportsPopupURL(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <UrlAnalysis/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportsPopupURL(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showReportsPopupData} onClose={() => setShowReportsPopupData(false)}>
        <DialogTitle>
          Data Correlation
          <IconButton
            aria-label="close"
            onClick={() => setShowReportsPopupData(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DataCorrelation/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportsPopupData(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sidebar;

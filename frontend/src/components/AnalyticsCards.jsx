import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { getStats } from '../api/employeeApi';
import { colorFor } from '../theme/brand';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return `Rs. ${numberFormatter.format(value)}`;
}

function StatCard({ icon, label, value, accent }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: '100%',
        borderLeft: `4px solid ${accent}`,
        transition: 'transform 120ms ease, box-shadow 120ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(16,24,40,0.08)',
        },
      }}
    >
      <Box
        sx={{
          bgcolor: `${accent}1F`,
          color: accent,
          borderRadius: 2,
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography
          noWrap
          sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1.15rem' }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

// Bonus: Department Analytics — total headcount + average salary per department.
function AnalyticsCards({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const departments = stats?.averageSalaryByDepartment
    ? Object.entries(stats.averageSalaryByDepartment)
    : [];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        {loading ? (
          <Skeleton variant="rounded" height={76} />
        ) : (
          <StatCard
            icon={<PeopleAltIcon />}
            label="Total Employees"
            value={stats ? stats.totalEmployees : '—'}
            accent="#0E7C7B"
          />
        )}
      </Grid>

      {loading &&
        [1, 2, 3].map((key) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Skeleton variant="rounded" height={76} />
          </Grid>
        ))}

      {!loading &&
        departments.map(([department, avgSalary]) => (
          <Grid item xs={12} sm={6} md={3} key={department}>
            <StatCard
              icon={<AccountBalanceWalletIcon />}
              label={`Avg. Salary — ${department}`}
              value={formatCurrency(Number(avgSalary))}
              accent={colorFor(department).bg}
            />
          </Grid>
        ))}
    </Grid>
  );
}

export default AnalyticsCards;

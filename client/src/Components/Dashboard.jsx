import React from 'react';



const Dashboard = ({ secretData }) => (
  <div className="container">
    <div
      title="Dashboard"
      subtitle="You should get access to this page only after authentication."
    />

    {/* {secretData && <div style={{ fontSize: '16px', color: 'green' }}>{secretData}</div>} */}
  </div>
);



export default Dashboard;

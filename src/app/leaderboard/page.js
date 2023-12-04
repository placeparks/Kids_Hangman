"use client"
import { useState, useEffect } from 'react';
import { useSupabase } from '@/supabase-provider';
import { useRouter } from 'next/navigation';
import Profile from '@/components/Profile';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleBack = () => {
    router.back(); // This will navigate the user back to the previous page
  };

  useEffect(() => {
    async function fetchLeaderboardData() {
      // Call the stored procedure instead of the standard select query
      const { data, error } = await supabase
      .rpc('get_aggregated_leaderboard');


      if (error) {
        console.error('Error fetching leaderboard data', error);
      } else {
        // Assuming your stored procedure returns user_id and total_score
        // Note: Since we're aggregating, we won't have individual 'id' and 'created_at' fields for each row
        const transformedData = data.map((item, index) => ({
          rank: index + 1,
          userId: item.user_id,
          score: item.total_score,
          date: item.last_activity // Adjust this line to use the last_activity from the stored procedure
        }));
        setLeaders(transformedData);
      }
    }

    fetchLeaderboardData();
  }, [supabase]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <button onClick={handleBack} style={backButtonStyle}>Back</button>
      <h1 style={{ textAlign: 'center', color:"white" }}>Leaderboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rank</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>User ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Score</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
  {leaders.map((leader, index) => (
    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{leader.rank}</td>
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leader.userId}</td>
      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{leader.score}</td>
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leader.date ? new Date(leader.date).toLocaleDateString() : 'N/A'}</td>
    </tr>
  ))}
</tbody>

      </table>
      <Profile/>
    </div>
  );
};
const backButtonStyle = {
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};

export default Leaderboard;

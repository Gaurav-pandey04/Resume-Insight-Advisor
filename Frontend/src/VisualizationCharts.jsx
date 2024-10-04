import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function VisualizationCharts({ topSkills, educationLevels }) {
  const skillsChartData = {
    labels: topSkills.map(item => item.skill),
    datasets: [
      {
        label: 'Skill Frequency',
        data: topSkills.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const educationChartData = {
    labels: educationLevels.map(item => item.level),
    datasets: [
      {
        label: 'Education Level Distribution',
        data: educationLevels.map(item => item.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Resume Data Visualization',
      },
    },
  };

  return (
    <div className="charts-container">
      <div className="chart">
        <h3>Top 10 Skills</h3>
        <div className="chart-wrapper">
          <Bar data={skillsChartData} options={options} />
        </div>
      </div>
      <div className="chart">
        <h3>Education Levels</h3>
        <div className="chart-wrapper">
          <Bar data={educationChartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default VisualizationCharts;

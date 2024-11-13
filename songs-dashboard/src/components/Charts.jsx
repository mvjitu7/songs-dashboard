import React from 'react';
import { Scatter, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary components and scales with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend);

const Charts = ({ songs }) => {
    const hasSongs = songs && songs.length > 0;

    // Common chart options
    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: { enabled: true },
            legend: { display: true },
        },
    };

    // Extract song titles
    const songTitles = hasSongs ? songs.map((song) => song.title) : ['No Data'];

    // Data for Danceability vs Energy Scatter Plot
    const danceabilityData = {
        datasets: [
            {
                label: 'Danceability vs Energy',
                data: hasSongs
                    ? songs.map((song) => ({
                          x: song.danceability,
                          y: song.energy,
                          title: song.title,
                      }))
                    : [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const scatterOptions = {
        ...commonChartOptions,
        plugins: {
            ...commonChartOptions.plugins,
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const { title, x, y } = context.raw;
                        return `${title}: Danceability - ${x}, Energy - ${y}`;
                    },
                },
            },
        },
    };

    // Data for Duration Histogram
    const durationHistogram = {
        labels: songTitles,
        datasets: [
            {
                label: 'Duration (seconds)',
                data: hasSongs ? songs.map((song) => song.duration_ms / 1000) : [],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    // Data for Acoustics and Tempo Bar Chart
    const acousticsTempoBar = {
        labels: songTitles,
        datasets: [
            {
                label: 'Acousticness',
                data: hasSongs ? songs.map((song) => song.acousticness) : [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Tempo',
                data: hasSongs ? songs.map((song) => song.tempo) : [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h2>Danceability vs Energy Scatter Plot</h2>
            <div style={{ height: '400px', width: '100%' }}>
                {hasSongs ? (
                    <Scatter data={danceabilityData} options={scatterOptions} />
                ) : (
                    <p>No data available to display the chart.</p>
                )}
            </div>

            <h2>Duration Histogram</h2>
            <div style={{ height: '400px', width: '100%' }}>
                {hasSongs ? (
                    <Bar data={durationHistogram} options={commonChartOptions} />
                ) : (
                    <p>No data available to display the chart.</p>
                )}
            </div>

            <h2>Acousticness and Tempo Bar Chart</h2>
            <div style={{ height: '400px', width: '100%' }}>
                {hasSongs ? (
                    <Bar data={acousticsTempoBar} options={commonChartOptions} />
                ) : (
                    <p>No data available to display the chart.</p>
                )}
            </div>
        </div>
    );
};

export default Charts;


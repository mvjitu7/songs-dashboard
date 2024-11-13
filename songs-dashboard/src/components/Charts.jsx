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
    // Define the bins
    const durationBins = [
        { label: '0-60 sec', min: 0, max: 60 },
        { label: '60-120 sec', min: 60, max: 120 },
        { label: '120-180 sec', min: 120, max: 180 },
        { label: '180-240 sec', min: 180, max: 240 },
        { label: '240-300 sec', min: 240, max: 300 },
        { label: '300-360 sec', min: 300, max: 360 },
        { label: '360+ sec', min: 360, max: Infinity },
    ];

    // Initialize counts for each bin
    const durationCounts = durationBins.map(() => 0);

    // Count the number of songs in each bin
    if (hasSongs) {
        songs.forEach(song => {
            const durationSec = song.duration_ms / 1000;
            for (let i = 0; i < durationBins.length; i++) {
                const bin = durationBins[i];
                if (durationSec >= bin.min && durationSec < bin.max) {
                    durationCounts[i]++;
                    break;
                } else if (bin.max === Infinity && durationSec >= bin.min) {
                    durationCounts[i]++;
                    break;
                }
            }
        });
    }

    // Prepare data for the histogram
    const durationHistogram = {
        labels: durationBins.map(bin => bin.label),
        datasets: [
            {
                label: 'Number of Songs',
                data: durationCounts,
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
            <h2 className="my-5">Danceability vs Energy Scatter Plot</h2>
            <div style={{ height: '520px', width: '100%' }}>
                {hasSongs ? (
                    <Scatter data={danceabilityData} options={scatterOptions} />
                ) : (
                    <p>No data available to display the chart.</p>
                )}
            </div>

            <h2 className="my-5">Duration Histogram</h2>
            <div style={{ height: '520px', width: '100%' }}>
                {hasSongs ? (
                    <Bar data={durationHistogram} options={commonChartOptions} />
                ) : (
                    <p>No data available to display the chart.</p>
                )}
            </div>

            <h2 className="my-5">Acousticness and Tempo Bar Chart</h2>
            <div className="mb-5" style={{ height: '520px', width: '100%' }}>
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

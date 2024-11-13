import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchSongs, rateSong } from '../api/songsApi';
import { CSVLink } from 'react-csv';
import { Container, Table, Button, InputGroup, FormControl, Modal } from 'react-bootstrap';
import Charts from './Charts';

const SongsTable = () => {
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState({});
    const [pagination, setPagination] = useState({ hasNextPage: true });
    const [totalPages, setTotalPages] = useState(1);
    const [noResults, setNoResults] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadData, setDownloadData] = useState([]);
    const csvLinkRef = useRef();

    const loadSongs = useCallback(async () => {
        try {
            const data = await fetchSongs(
                page,
                sortConfig.key,
                sortConfig.direction,
                10, // perPage
                title.trim()
            );
            setSongs(data.data || []);
            const paginationData = data.pagination;
            setPagination({ hasNextPage: paginationData.next_page !== null });
            setTotalPages(paginationData.total_pages);
            setNoResults(data.data.length === 0);
        } catch (error) {
            console.error("Error loading songs:", error);
            setSongs([]);
            setNoResults(true);
        }
    }, [page, sortConfig.key, sortConfig.direction, title]);

    useEffect(() => {
        loadSongs();
    }, [loadSongs]);

    const handleSort = useCallback((key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
        setPage(1);
    }, []);

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? (
                <i className="bi bi-arrow-up"></i>
            ) : (
                <i className="bi bi-arrow-down"></i>
            );
        }
    };

    const handleSearch = () => {
        setPage(1);
        loadSongs();
    };

    const fetchAllSongs = async () => {
        let allResults = [];
        let currentPage = 1;
        let moreResultsAvailable = true;

        while (moreResultsAvailable) {
            const data = await fetchSongs(
                currentPage,
                sortConfig.key,
                sortConfig.direction,
                10, // perPage
                title.trim()
            );
            const results = data.data || [];
            allResults = allResults.concat(results);
            moreResultsAvailable = data.pagination.next_page !== null;
            currentPage++;
        }

        return allResults;
    };

    const handleDownloadClick = async (downloadAll) => {
        setShowDownloadModal(false);
        if (downloadAll) {
            const data = await fetchAllSongs();
            setDownloadData(data);
        } else {
            setDownloadData(songs);
        }
        setTimeout(() => {
            if (csvLinkRef.current && csvLinkRef.current.link) {
                csvLinkRef.current.link.click();
            }
        }, 0);
    };

    const handleRating = useCallback(async (id, rate) => {
        try {
            await rateSong(id, rate);
            setRating((prevRatings) => ({ ...prevRatings, [id]: rate }));
            setSongs((prevSongs) =>
                prevSongs.map((song) =>
                    song.id === id ? { ...song, rating: rate } : song
                )
            );
        } catch (error) {
            console.error("Error rating song:", error);
            alert("An error occurred while rating the song.");
        }
    }, []);

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setPage((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleDownloadConfirmation = () => { !noResults && setShowDownloadModal(true);}
    const handleModalClose = () => setShowDownloadModal(false);

    return (
        <Container>
            <h2 className="text-center my-4">Songs Dashboard</h2>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search by title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <Button variant="primary" onClick={handleSearch}>Get Song</Button>
                <Button variant="outline-secondary" onClick={handleDownloadConfirmation}>
                    Download CSV
                </Button>
            </InputGroup>

            <Modal show={showDownloadModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Download Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Would you like to download just the current page or all songs?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleDownloadClick(false)}>
                        Current Page Only
                    </Button>
                    <Button variant="primary" onClick={() => handleDownloadClick(true)}>
                        All Songs
                    </Button>
                </Modal.Footer>
            </Modal>

            <CSVLink
                data={downloadData}
                filename="songs_data.csv"
                className="d-none"
                ref={csvLinkRef}
                target="_blank"
            />

            {noResults && (
                <p className="text-center text-muted">No results found. Please try another search.</p>
            )}

            {!noResults && (
                <>
                    <Table striped bordered hover responsive className="text-center">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>Title {getSortIcon('title')}</th>
                                <th onClick={() => handleSort('danceability')} style={{ cursor: 'pointer' }}>Danceability {getSortIcon('danceability')}</th>
                                <th onClick={() => handleSort('energy')} style={{ cursor: 'pointer' }}>Energy {getSortIcon('energy')}</th>
                                <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer' }}>Rating {getSortIcon('rating')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {songs.map((song) => (
                                <tr key={song.id}>
                                    <td>{song.title}</td>
                                    <td>{song.danceability}</td>
                                    <td>{song.energy}</td>
                                    <td>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onClick={() => handleRating(song.id, star)}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: star <= (rating[song.id] || song.rating || 0) ? '#FFD700' : '#C0C0C0',
                                                }}
                                            >
                                                {star <= (rating[song.id] || song.rating || 0) ? '★' : '☆'}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between my-4">
                        <Button
                            variant="secondary"
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="secondary"
                            onClick={handleNextPage}
                            disabled={!pagination.hasNextPage}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}

            {!noResults && (<Charts songs={songs} />)}
        </Container>
    );
};

export default SongsTable;


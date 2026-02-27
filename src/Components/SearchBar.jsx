import { useEffect, useState } from 'react';
import '../Style/SearchBar.css';
import { FiSearch } from "react-icons/fi";
import FileIcons from './FileIcons';

export default function SearchBar({ cancel, searchResult }) {
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        setFiles([]);
        setFolders([]);
    }, [])

    async function searchParam(userInput) {
        try {
            const response = await fetch("http://localhost:8080/WorkDrive/SearchBarServlet?search=" + userInput, {
                method: "GET",
                credentials: "include"
            });


            const data = await response.json();

            if (data.resource.files) {
                setFiles(data.resource.files);
            } else {
                setFiles([]);
            }
            if (data.resource.folders) {
                setFolders(data.resource.folders);
            } else {
                setFolders([]);
            }

            console.log(files, folders);
        } catch (err) {
            console.log("Technical Issue");
        }
    }

    function closePopUp() {
        cancel(false);
    }


    return <div className="search-bar-container" onClick={(e) => {
        if (e.target == e.currentTarget) {
            closePopUp();
        }
    }}>
        <div className='searching-space'>
            <div className='searching-container'>
                <FiSearch className='search-icon' />
                <input placeholder='Search by name, keyboard and more' className='search-input' onChange={(e) => { searchParam(e.target.value); if (e.target.value == "") { setFiles([]); setFolders([]) } }}></input>
                <button title='Close' className='search-cancel' onClick={() => { cancel(false) }}>X</button>
            </div>
            <div className='search-result-container'>

                {folders.length > 0 && (
                    <div>
                        <div className='search-section'>FOLDERS</div>
                        {folders.map((e) => (
                            <div key={e.resourceId} className='search-result-components'>
                                <svg width={24} height={24} viewBox="0 0 24 24" fill="none"> <path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
                                <div>
                                    <p className='search-content-title'>{e.resourceName}</p>
                                    <p className='search-content-detail'>{e.createdTime ? "Created at " + e.createdTime : "Modified at " + e.modifiedTime}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {files.length > 0 && (
                    <div>
                        <div className='search-section'>FILES</div>
                        {files.map((e) => (
                            <div title='Shows in folder' key={e.resourceId} className='search-result-components'>
                                <FileIcons>{e.resourceName}</FileIcons>
                                <div>
                                    <p className='search-content-title'>{e.resourceName}</p>
                                    <p className='search-content-detail'>{e.createdTime ? "Created at " + e.createdTime : "Modified at " + e.modifiedTime}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    </div>
}
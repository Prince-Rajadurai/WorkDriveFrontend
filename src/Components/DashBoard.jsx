import { useEffect, useState } from 'react';
import { GrStorage } from "react-icons/gr";
import { HiOutlineDuplicate } from "react-icons/hi";
import { LiaFileSolid } from "react-icons/lia";
import { MdCompress } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import '../Style/DashBoard.css';
import MyPieChart from './MyPieChart';

export default function DashBoard() {

    useEffect(() => {
        showData();
    }, [])

    const [data, setData] = useState({});
    const [s_size, set_s_size] = useState("");
    const [c_size, set_c_size] = useState("");

    async function showData() {

        const response = await fetch("http://localhost:8080/WorkDrive/ShowDashBoard", {
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();

        console.log(data);

        setData(data);
        set_s_size(data.storageBytesValue);
        set_c_size(data.compressByteValue);

    }

    return (
        <>

            <div className="dash-board-main">
                <div className="dash-board-heading">
                    <h2>Storage Summary</h2>
                    <p>Real-time optimization performance and capacity monitoring.</p>
                </div>
                <div className="dash-board-container">
                    <div className="dash-board-storage">
                        <div className="storage-icon-view">
                            <GrStorage size={40} className='storage-icon' color='#3B82F6' style={{ backgroundColor: "#E8F1FF" }} />
                            <p>Original Size</p>
                        </div>
                        <h2>{data.compress_size}</h2>
                    </div>
                    <div className="dash-board-storage">
                        <div className="storage-icon-view">
                            <MdCompress size={40} className='compress-icon' color='#10B981' style={{ backgroundColor: "#ECFDF5" }} />
                            <p>Compress Size</p>
                        </div>
                        <h2>{data.total_size}</h2>
                    </div>
                    <div className="dash-board-storage">
                        <div className="storage-icon-view">
                            <LiaFileSolid size={40} className='files-icon' color='#6F73F2' style={{ backgroundColor: "#EEF2FF" }} />
                            <p>Total Files</p>
                        </div>
                        <div className="dash-files">
                            <h2>{data.total_files}</h2>
                            <p>Files</p>
                        </div>
                    </div>
                    <div className="dash-board-storage">
                        <div className="storage-icon-view">
                            <FaFolder size={40} className='files-icon' color='#D97706' style={{ backgroundColor: "#FFFBEB" }} />
                            <p>Total Folders</p>
                        </div>
                        <div className="dash-files">
                            <h2>{data.folderCount-1}</h2>
                            <p>Folders</p>
                        </div>
                    </div>
                    <div className="dash-board-storage">
                        <div className="storage-icon-view">
                            <HiOutlineDuplicate size={40} className='d-files-icon' color='#F6AC2C' style={{ backgroundColor: "#FFFBEB" }} />
                            <p>File Deduplicated</p>
                        </div>
                        <div className="dash-files">
                            <h2>{data.deduplicate_files}</h2>
                            <p>Files</p>
                        </div>
                    </div>
                </div>
                <div className="dash-board-percentage-chart">

                    <div className="dash-board-percentage-view">
                        <div className="percentage-heading">
                            <h2>Storage Efficiency Overview</h2>
                            <p>Efficiency metrics of current storage engine.</p>
                        </div>
                        <div className="compress-percentage">
                            <div className="dash-container">
                                <div className="show-compress-percentage" style={{ background: `conic-gradient(#2ecc719e ${data.storage_precentage}%, #eee 0%)` }}>
                                    <div className="inner-percentage-show-container">
                                        {data.storage_precentage}%
                                    </div>
                                </div>
                                <div className="compress-percentage-description">
                                    <h3>Storage Efficiency</h3>
                                    <p>Overall storage utilization score</p>
                                </div>
                            </div>
                            <div className="sizes">
                                <h1 id='size'>{data.saved}</h1>
                            </div>
                        </div>
                        <div className="compress-percentage">
                            <div className='dash-container'>
                                <div className="show-compress-percentage" style={{ background: `conic-gradient(#3b82f6a3 ${data.deduplicate_files_precentage}%, #eee 0%)` }}>
                                    <div className="inner-percentage-show-container" >
                                        {data.deduplicate_files_precentage}%
                                    </div>
                                </div>
                                <div className="compress-percentage-description">
                                    <h3>Deduplication Ratio</h3>
                                    <p>Percent of redundant data purged</p>
                                </div>
                            </div>
                            <div className="sizes">
                                <h1 id='size'>{data.deduplicate_files}</h1>
                            </div>
                        </div>
                        <div className="compress-percentage">
                            <div className="dash-container">
                                <div className="show-compress-percentage" style={{ background: `conic-gradient(#f39c1294 ${data.deduplicate_size_percentage}%, #eee 0%)` }}>
                                    <div className="inner-percentage-show-container">
                                        {data.deduplicate_size_percentage}%
                                    </div>
                                </div>
                                <div className="compress-percentage-description">
                                    <h3>Deduplication size</h3>
                                    <p>Percent of redundant data purged</p>
                                </div>
                            </div>
                            <div className="sizes">
                                <h1 id='size'>{data.deduplicate_size}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="dash-board-chart-view">
                        <div className="dash-board-chart-heading">
                            <h2>Storage Usage Breakdown</h2>
                            <p>Comparison across different data states.</p>
                        </div>
                        <MyPieChart className="chart" senData={data} tSize={s_size} cSize={c_size}></MyPieChart>
                    </div>
                </div>
            </div>

        </>
    );

}
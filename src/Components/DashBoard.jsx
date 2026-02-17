import { useEffect, useState } from 'react';
import { GrStorage } from "react-icons/gr";
import { HiOutlineDuplicate } from "react-icons/hi";
import { LiaFileSolid } from "react-icons/lia";
import { MdCompress } from "react-icons/md";
import '../Style/DashBoard.css';
import MyPieChart from './MyPieChart';

export default function DashBoard() {

    useEffect(()=>{
        showData();
    },[])

    const [data , setData] = useState({});
    const [s_size , set_s_size] = useState("");
    const [c_size , set_c_size] = useState("");

    async function showData(){

        const response = await fetch("http://localhost:8080/WorkDrive/ShowDashBoard",{
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();

        console.log(data);

        setData(data);
        set_s_size(data.total_size);
        set_c_size(data.compress_size);


    }

    return (
        <>

            <div className="dash-board-main">
                <div className="heading">
                    <h2>Storage Summary</h2>
                </div>
                <div className="dash-board-containers">

                    <div className="total-storage-container" id='dashboard-container'>
                        <div className="total-storage-container-heading">
                            <GrStorage color='#3B82F6' size={25} />
                            <h4>Original Size</h4>
                        </div>
                        <h1>{data.compress_size}</h1>
                    </div>

                    <div className="total-compress-container" id='dashboard-container'>
                        <div className="total-compress-container-heading">
                            <MdCompress color='#10B981' size={25} />
                            <h4>Compressed Size</h4>
                        </div>
                        <h1>{data.total_size}</h1>
                    </div>

                    <div className="total-files-container" id='dashboard-container'>
                        <div className="total-files-container-heading">
                            <LiaFileSolid color='#6366F1' size={25} />
                            <h4>Total Files</h4>
                        </div>
                        <div className="files">
                            <h1>{data.total_files}</h1>
                            <p>Files</p>
                        </div>
                    </div>

                    <div className="total-duplicate-container" id='dashboard-container'>
                        <div className="total-duplicate-container-heading">
                            <HiOutlineDuplicate color='#F59E0B' size={25} />
                            <h4>Files Deduplicated</h4>
                        </div>
                        <div className="files">
                            <h1>{data.deduplicate_files}</h1>
                            <p>Files</p>
                        </div>
                    </div>

                </div>
                <div className="dash-board-percentage">
                    <div className="percentage-view">
                        <h2 className='heading2'>Optimization Performance</h2>
                        <div className="dash-board-compress-percentage">
                            <p>Storage used Percentage</p>
                            <div className="c-percentage-view">
                                <h2>{data.storage_size < data.deduplicate_size ? Math.floor(((data.storage_size/data.deduplicate_size)*100)) : Math.floor(((data.deduplicate_size/data.storage_size)*100))}%</h2>
                                <div className="c-outer-percentage">
                                    <div className="c-inner-percentage" style={{width:`${data.storage_size < data.deduplicate_size ? Math.floor(((data.storage_size/data.deduplicate_size)*100)) : Math.floor(((data.deduplicate_size/data.storage_size)*100))}}%`}}></div>
                                </div>
                            </div>
                        </div>

                        <div className="dash-board-duplicate-percentage">
                            <p>Files Deduplicated Percentage</p>
                            <div className="d-percentage-view">
                                <h2>{Math.floor(((data.deduplicate_files/data.total_files)*100))}%</h2>
                                <div className="d-outer-percentage" >
                                    <div className="d-inner-percentage" style={{width:`${Math.floor(((data.deduplicate_files/data.total_files)*100))}%`}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bar-Chart">
                        <MyPieChart className="chart" senData={data} tSize={s_size} cSize={c_size}></MyPieChart>
                    </div>
                </div>
            </div>

        </>
    );

}
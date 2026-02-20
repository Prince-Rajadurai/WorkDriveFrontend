import React from "react";
import { ProgressBar } from "primereact/progressbar";
import '../Style/Progress.css';
import { TbCloudUpload } from "react-icons/tb";
        

export default function Progress({ value = 0, total = 100, type, fileName, show }) {

    if (value === 0) {
        return (
            <div id={show ? "progress-show" : ""} className="card" >
                <div className="progress-label">
                    <TbCloudUpload />
                    <p>{fileName}</p>
                </div>
            <progress className="progress-bar"></progress>
        
            </div>
        );
    }

    const percent = (value / total) * 100;

    return (
        <div id={show ? "progress-show" : ""} className="card" >
            <div className="progress-label">
                <TbCloudUpload />
                <p>{fileName}</p>
                <p>{type === "FILE" ? "( " + value.toFixed(2) + "% )" : "( " + value + "/" + total + " )"}</p>
            </div>
            <progress
                value={type == "FILE" ? percent : value}
                max={type == "FILE" ? "100" : total}
                className="progress-bar"
            />
        </div>
    );
}


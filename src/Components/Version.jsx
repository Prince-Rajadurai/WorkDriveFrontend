import { GoVersions } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { VscVersions } from "react-icons/vsc";
import { MdOutlineStorage, MdOutlineCompress } from "react-icons/md";
import { BiMemoryCard } from "react-icons/bi";
import "../Style/Version.css";

export default function Version({ size, storage, compressSize, versions = [], onclose }) {
    const reversedVersions = [...versions].reverse();
    return (
        <>
            <div className="version-main">
                <div className="close-button">
                    <div className="version-heading-icon">
                        <div className="file-details">
                            <VscVersions size={40} className='version-head-icon' />
                            <h3>File Versions</h3>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onclose}>
                        <IoClose />
                    </button>
                </div>
                <div className="version-heading">
                    <div className="storage-size-view">
                        <div className="current-size">
                            <div className="description">
                                <BiMemoryCard size={25} color='#F6AC2C' />
                                <p >File Size</p>
                            </div>
                            <h3 id="version-size">{storage}</h3>
                        </div>
                        <div className="compress-size">
                            <div className="description">
                                <MdOutlineCompress size={25} color='#18BC86' />
                                <p>Compressed Size</p>
                            </div>
                            <h3 id="version-size">{compressSize}</h3>
                        </div>
                        <div className="storage-size">
                            <div className="description">
                                <MdOutlineStorage size={25} color='#3C82F6' />
                                <p>Storage Used</p>
                            </div>
                            <h3 id="version-size">{size}</h3>
                        </div>
                    </div>
                </div>
                <span className='version-list'>Top Version</span>
                <div className="version-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Version</th>
                                <th>Date</th>
                                <th>Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reversedVersions.map((version, index) => (
                                <tr key={index}>
                                    <td>#{version.version}</td>
                                    <td>{version.time}</td>
                                    <td>{version.size}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
import { GoVersions } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { VscVersions } from "react-icons/vsc";
import { MdOutlineStorage } from "react-icons/md";
import "../Style/Version.css";

export default function Version({ size, storage,compressSize, versions = [], onclose }) {
    const reversedVersions = [...versions].reverse();
  return (
    <>
            <div className="version-main">
                <div className="close-button">
                  <button className="close-btn" onClick={onclose}>
                      <IoClose />
                   </button>
                </div>
                <div className="version-heading">
                    <div className="version-heading-icon">
                        <div className="file-details">
                            <VscVersions size={50} className='version-head-icon'/>
                        </div>
                        <div className="size-details">
                          <h3>File Versions</h3>
                            <p id="str_size">Size : {storage}</p>
                            <p id="cmp_size">Reduced File Size : {compressSize}</p>
                        </div>
                    </div>
                    <div className="storage-size-view">
                        <MdOutlineStorage size={25} color='#3C82F6'/>
                        <p>Storage Used : {size}</p>
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
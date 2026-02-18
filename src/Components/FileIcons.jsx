export const EXT_GROUPS = {
    // ---------- Audio ----------
    audio: [
        "mp3", "wav"
    ],

    // ---------- Video ----------
    video: [
        "mp4", "mpeg", "mkv", "avi"
    ],

    // ---------- Images ----------
    image: [
        "png", "jpg", "jpeg", "gif",
        "webp", "tiff", "svg"
    ],

    // ---------- Documents ----------
    document: [
        "pdf", "txt", "doc", "docx"
    ],

    // ---------- Spreadsheet ----------
    spreadsheet: [
        "xls", "xlsx", "csv"
    ],

    // ---------- Presentations ----------
    presentation: [
        "ppt", "pptx"
    ],

    // ---------- Archives ----------
    archive: [
        "zip", "rar"
    ],

    // ---------- Code / Dev ----------
    code: [
        "js", "json", "css", "html",
        "xml", "java", "sql"
    ],

    // ---------- Design / Creative ----------
    design: [
        "fig", "psd", "ai",
        "eps", "indd", "aep"
    ],

    // ---------- System / Binary ----------
    binary: [
        "exe", "dmg"
    ]
};

const AudioIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M4.75 4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25H8A3.25 3.25 0 0 1 4.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M24 .5V8a4 4 0 0 0 4 4h7.5" />
    <path
        stroke="#DD2590"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.85 28.5v-8.733c0-.362 0-.542.066-.689a.75.75 0 0 1 .269-.317c.133-.089.312-.119.668-.178l6.6-1.1c.48-.08.72-.12.908-.05a.75.75 0 0 1 .39.33c.099.172.099.416.099.904V27m-9 1.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0m9-1.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0"
    />
</svg>;



const VideoIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M4.75 4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25H8A3.25 3.25 0 0 1 4.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M24 .5V8a4 4 0 0 0 4 4h7.5" />
    <g stroke="#155EEF" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} clipPath="url(#video-02_svg__a)">
        <path d="M20 31.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15" />
        <path d="M18.125 21.724c0-.358 0-.537.075-.637a.38.38 0 0 1 .273-.15c.125-.008.275.089.576.282l3.54 2.276c.262.168.393.252.438.359a.37.37 0 0 1 0 .292c-.045.107-.176.19-.437.359l-3.54 2.276c-.302.193-.452.29-.577.281a.38.38 0 0 1-.273-.15c-.075-.1-.075-.278-.075-.636z" />
    </g>
    <defs>
        <clipPath id="video-02_svg__a">
            <path fill="#fff" d="M11 15h18v18H11z" />
        </clipPath>
    </defs>
</svg>;



const ImageIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M4.75 4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25H8A3.25 3.25 0 0 1 4.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M24 .5V8a4 4 0 0 0 4 4h7.5" />
    <path
        stroke="#7F56D9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M25.25 30.75h.758c.728 0 1.092 0 1.293-.152a.75.75 0 0 0 .296-.553c.015-.252-.187-.555-.59-1.16l-2.259-3.387c-.333-.501-.5-.751-.71-.839a.75.75 0 0 0-.575 0c-.21.088-.378.338-.712.839l-.558.837m3.057 4.415-5.763-8.325c-.332-.479-.498-.718-.705-.802a.75.75 0 0 0-.564 0c-.207.084-.373.323-.705.802l-4.46 6.442c-.422.61-.633.915-.62 1.168a.75.75 0 0 0 .293.56c.201.155.572.155 1.314.155zm1.5-11.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0"
    />
</svg>;



const DocumentIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M4.75 4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25H8A3.25 3.25 0 0 1 4.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M24 .5V8a4 4 0 0 0 4 4h7.5" />
    <path
        stroke="#155EEF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M11.9 19.5h16.2m-16.2 3.6h16.2m-16.2 3.6h16.2m-16.2 3.6h12.6"
    />
</svg>;



const SheetIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M4.75 4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25H8A3.25 3.25 0 0 1 4.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M24 .5V8a4 4 0 0 0 4 4h7.5" />
    <path
        stroke="#079455"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M11.9 24.9h16.2m-16.2 0v-3.6a1.8 1.8 0 0 1 1.8-1.8h3.6m-5.4 5.4v3.6a1.8 1.8 0 0 0 1.8 1.8h3.6m10.8-5.4v3.6a1.8 1.8 0 0 1-1.8 1.8h-9m10.8-5.4v-3.6a1.8 1.8 0 0 0-1.8-1.8h-9m0 0v10.8"
    />
</svg>;



const PptIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M7.75 4A3.25 3.25 0 0 1 11 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 35 39.25H11A3.25 3.25 0 0 1 7.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M27 .5V8a4 4 0 0 0 4 4h7.5" />
    <rect width={26} height={16} x={1} y={18} fill="#E62E05" rx={2} />
    <path
        fill="#fff"
        d="M4.818 30v-7.273h2.869q.828 0 1.41.316.582.314.888.87.309.555.309 1.279T9.98 26.47t-.906.863q-.589.309-1.427.309H5.819V26.41H7.4q.444 0 .732-.153.29-.156.433-.43.146-.276.146-.635 0-.363-.146-.632a.97.97 0 0 0-.433-.423q-.29-.153-.739-.153H6.355V30zm6.474 0v-7.273h2.87q.826 0 1.41.316.582.314.887.87.31.555.31 1.279t-.313 1.278q-.313.555-.906.863-.59.309-1.428.309h-1.828V26.41h1.58q.444 0 .731-.153.292-.156.434-.43.145-.276.145-.635 0-.363-.145-.632a.97.97 0 0 0-.434-.423q-.291-.153-.738-.153H12.83V30zm6.198-6.005v-1.268h5.973v1.268h-2.227V30h-1.52v-6.005z"
    />
</svg>;



const ArchiveIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M7.75 4A3.25 3.25 0 0 1 11 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 35 39.25H11A3.25 3.25 0 0 1 7.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M27 .5V8a4 4 0 0 0 4 4h7.5" />
    <rect width={22} height={16} x={1} y={18} fill="#344054" rx={2} />
    <path
        fill="#fff"
        d="M4.58 30v-.913l3.63-5.092H4.573v-1.268h5.568v.913L6.51 28.732h3.64V30zm8.286-7.273V30h-1.538v-7.273zM14.131 30v-7.273h2.87q.826 0 1.41.316.58.314.887.87.309.555.309 1.279t-.312 1.278-.906.863q-.59.309-1.428.309h-1.828V26.41h1.58q.444 0 .731-.153.292-.156.434-.43.145-.276.145-.635 0-.363-.145-.632a.97.97 0 0 0-.434-.423q-.291-.153-.738-.153h-1.037V30z"
    />
</svg>;



const CodeIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M4.75 4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25H8A3.25 3.25 0 0 1 4.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M24 .5V8a4 4 0 0 0 4 4h7.5" />
    <path
        stroke="#444CE7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M23.75 27.75 27.5 24l-3.75-3.75m-7.5 0L12.5 24l3.75 3.75m5.25-10.5-3 13.5"
    />
</svg>;



const DesignIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M7.75 4A3.25 3.25 0 0 1 11 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 35 39.25H11A3.25 3.25 0 0 1 7.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M27 .5V8a4 4 0 0 0 4 4h7.5" />
    <rect width={17} height={16} x={1} y={18} fill="#E04F16" rx={2} />
    <path
        fill="#fff"
        d="M6.244 30H4.596l2.511-7.273h1.982L11.596 30H9.948l-1.822-5.61H8.07zm-.103-2.859h3.892v1.2H6.141zm7.868-4.414V30H12.47v-7.273z"
    />
</svg>;


const BinaryIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M7.75 4A3.25 3.25 0 0 1 11 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 35 39.25H11A3.25 3.25 0 0 1 7.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M27 .5V8a4 4 0 0 0 4 4h7.5" />
    <rect width={26} height={16} x={1} y={18} fill="#444CE7" rx={2} />
    <path
        fill="#fff"
        d="M4.935 30v-7.273h4.9v1.268H6.472v1.733h3.111v1.268h-3.11v1.736H9.85V30zm7.565-7.273 1.466 2.479h.057l1.474-2.479h1.736l-2.22 3.637L17.284 30h-1.768l-1.492-2.482h-.057L12.475 30h-1.762l2.277-3.636-2.234-3.637zM18.206 30v-7.273h4.9v1.268h-3.362v1.733h3.11v1.268h-3.11v1.736h3.377V30z"
    />
</svg>;


const DefaultIcon = () => <svg width={28} height={28} fill="none" viewBox="0 0 40 40">
    <path
        stroke="black"
        strokeWidth={0.5}
        d="M4.75 4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25H8A3.25 3.25 0 0 1 4.75 36z"
    />
    <path stroke="black" strokeWidth={0.5} d="M24 .5V8a4 4 0 0 0 4 4h7.5" />
</svg>;





const getGroup = (filename) => {
    const ext = filename.toLowerCase().split(".").pop();

    for (const group in EXT_GROUPS) {
        if (EXT_GROUPS[group].includes(ext)) {
            return group;
        }
    }

    return "default";
};

const ICON_MAP = {
    audio: <AudioIcon />,
    video: <VideoIcon />,
    image: <ImageIcon />,
    document: <DocumentIcon />,
    spreadsheet: <SheetIcon />,
    presentation: <PptIcon />,
    archive: <ArchiveIcon />,
    code: <CodeIcon />,
    design: <DesignIcon />,
    binary: <BinaryIcon />,
    default: <DefaultIcon />
};


export default function FileIcons({ children }) {

    const group = getGroup(children);

    return ICON_MAP[group] || ICON_MAP.default;
}






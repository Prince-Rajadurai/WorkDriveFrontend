import Button from './Button.jsx'

export default function NewButton({ children }) {

   return (
      <>
         <button id="newButton">{children}</button>
         <Button className="dropItems">Create File</Button>
         <Button className="dropItems">Create Folder</Button>
         <Button className="dropItems">Upload File</Button>
         <Button className="dropItems">Upload Folder</Button>
      </>
   );
}
import { Icon } from '@fluentui/react/lib/Icon';
import {
  getFileTypeIconProps,
  initializeFileTypeIcons
} from '@fluentui/react-file-type-icons';

initializeFileTypeIcons();

export default function FileIcons({children}) {

    let arr=children.split(".");
  return (
    <Icon {...getFileTypeIconProps({ extension: arr[arr.length-1], size: 32 })} />
  );
}

"use client"
import { useState, useEffect } from "react";

import StyleSelector from "@/app/components/items/styleSelector";
import DropdownBox from "@/app/components/wrappers/dropdownBox";
import BindSibling from "@/app/components/wrappers/siblingBinder";

import { Terminal } from "@/scripts/terminal";
import { BBFile, BBDirectory } from "@/scripts/filesystem";

import dropdownBoxstyles from "@/app/styles/semiComponents.module.css";

export default function StyleDropDown() {
    const [styleFiles, setStyleFiles] = useState<BBFile[]>([]);

	useEffect(() => {
		function loadStyles() {
			const styleDir = Terminal.instance.fileSystem.getFileFromPathString("/styles") as BBDirectory;
			const styleFiles = styleDir.getAllFiles();
			const filteredFiles = styleFiles.filter((file: BBFile) => file.name.endsWith(".sty"));
			setStyleFiles(filteredFiles);
		}

		loadStyles();
	}, []);
    

    return (
        <BindSibling hashString={"style-dropdown-box"}>
            <DropdownBox clickable={true} className={dropdownBoxstyles.styleDropdown} placeholder={<svg className={dropdownBoxstyles.dropdownBoxIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 21.832c4.587.38 2.944-4.493 7.188-4.538l1.838 1.534c.458 5.538-6.315 6.773-9.026 3.004zm14.065-7.115c1.427-2.239 5.847-9.749 5.847-9.749.352-.623-.43-1.273-.976-.813 0 0-6.572 5.714-8.511 7.525-1.532 1.432-1.539 2.086-2.035 4.447l1.68 1.4c2.227-.915 2.868-1.039 3.995-2.81zm-11.999 3.876c.666-1.134 1.748-2.977 4.447-3.262.434-2.087.607-3.3 2.547-5.112 1.373-1.282 4.938-4.409 7.021-6.229-1-2.208-4.141-4.023-8.178-3.99-6.624.055-11.956 5.465-11.903 12.092.023 2.911 1.081 5.571 2.82 7.635 1.618.429 2.376.348 3.246-1.134zm6.952-15.835c1.102-.006 2.005.881 2.016 1.983.004 1.103-.882 2.009-1.986 2.016-1.105.009-2.008-.88-2.014-1.984-.013-1.106.876-2.006 1.984-2.015zm-5.997 2.001c1.102-.01 2.008.877 2.012 1.983.012 1.106-.88 2.005-1.98 2.016-1.106.007-2.009-.881-2.016-1.988-.009-1.103.877-2.004 1.984-2.011zm-2.003 5.998c1.106-.007 2.01.882 2.016 1.985.01 1.104-.88 2.008-1.986 2.015-1.105.008-2.005-.88-2.011-1.985-.011-1.105.879-2.004 1.981-2.015zm10.031 8.532c.021 2.239-.882 3.718-1.682 4.587l-.046.044c5.255-.591 9.062-4.304 6.266-7.889-1.373 2.047-2.534 2.442-4.538 3.258z"/></svg>}>
            {
                styleFiles && styleFiles.map((styleFile) => {
                    return <StyleSelector key={styleFile.name} styleFile={styleFile}/>
                })
            }
            </DropdownBox>
        </BindSibling>
    )
}
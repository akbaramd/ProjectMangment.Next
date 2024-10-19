import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiEnvelopeDuotone, PiMemberOfDuotone, PiUsersDuotone,
    PiLockDuotone
} from 'react-icons/pi'
import {
    SlEnvolopeLetter,
   
} from 'react-icons/sl'
export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    singleMenu: <PiEnvelopeDuotone />,
    invitationMenu: <PiEnvelopeDuotone  />,
    membersMenu: <PiUsersDuotone  />,
    rolesMenu: <PiLockDuotone  />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />
}

export default navigationIcon

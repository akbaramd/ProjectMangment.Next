import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiEnvelopeDuotone, PiMemberOfDuotone, PiUsersDuotone,
    PiLockDuotone,
    PiBagDuotone,
    PiShoppingBagDuotone,
    PiFactoryDuotone,
    PiProjectorScreenChartDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import {
    SlEnvolopeLetter,
   
} from 'react-icons/sl'
export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    projectSection: <PiProjectorScreenChartDuotone />,
    tenantSection: <PiUsersDuotone />,
    singleMenu: <PiEnvelopeDuotone />,
    invitationMenu: <PiEnvelopeDuotone  />,
    membersMenu: <PiUserDuotone  />,
    rolesMenu: <PiLockDuotone  />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />
}

export default navigationIcon

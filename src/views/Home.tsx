import { useTenant } from '@/tenant/TenantContext'
import { Card } from '@/components/ui'
import { TenantMemberStatus } from '@/@types/tenant'

const Home = () => {

    var { tenant } = useTenant()
   
    
    return <Card >
        <div>
            
            <h4 className="mb-1">{tenant?.name}</h4>
            <p>subdomain : {tenant?.subdomain}</p>
            <p>members : {tenant?.members?.length}</p>
            <p>status : {TenantMemberStatus[tenant?.status??TenantMemberStatus.Inactive]}</p>
        </div>
    </Card>
}

export default Home

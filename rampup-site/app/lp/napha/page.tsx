import FunnelPage from '@/components/FunnelPage'
import { funnelPages } from '@/lib/funnel-pages'

export default function Page() {
  return <FunnelPage config={funnelPages['napha']} />
}

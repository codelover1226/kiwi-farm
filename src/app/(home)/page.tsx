import ProductPage from '@/components/ProductPage';
import { NewMemberForm } from '@/components/NewMemberForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import MemberSection from '@/components/Member';
function Home() {
  const l = "asdf";
  return (
    <div>
      <ProductPage />
      <MemberSection />
    </div>
  );
}
Home.layout = "asdf";
export default Home;

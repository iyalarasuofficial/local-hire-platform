import UserNav from '../../components/user/UserNav'
import ReviewsComponent from '../../components/user/ReviewsComponent';
import WorkerDetail from '../../components/user/WorkerDetail';
import Footer from '../../components/landing/Footer';

const ViewProfile = () => {
  return (
    <>
    <UserNav/>
    <WorkerDetail/>
    <ReviewsComponent/>
    <Footer panelType="user"/>
    </>
  )
}

export default ViewProfile




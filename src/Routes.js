import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header, {Footer} from './Include';

// Mentee Component
import Mentors from './Component/Mentors/Mentors';
import Coursedetail from './Component/Mentors/Coursedetail';
import Cart from './Component/Mentors/Cart';
import Wishlist from './Component/Mentors/Wishlist';
import CoursePayment from './Component/Mentors/CoursePayment';
import Register from './Component/Register/Register';
import CoursePaymentMentee from './Component/Register/CoursePayment';


// Programs Component
import Programs from './Component/Programs/Programs';
import Curriculum from './Component/Programs/Curriculum';
import Task from './Component/Programs/Task';
import Files from './Component/Programs/Files';
import Projectsubmit from './Component/Programs/Projectsubmit';
import Review from './Component/Programs/Review';
import CurriLeaderboard from './Component/Programs/CurriLeaderboard';
import TaskLeaderboard from './Component/Programs/TaskLeaderboard';
import ProjectLeaderboard from './Component/Programs/ProjectLeaderboard';
import Certificate from './Component/Programs/Certificate';
import ReportMentee from './Component/Programs/ReportMentee';

// Mentors Component
import Mentorpolicy from './Component/Mentors/Mentorpolicy';
import Mentorform from './Component/Mentors/Mentorform';
import Mentorprofile from './Component/Mentors/Mentorprofile';
import CreateCurriculum from './Component/Mentors/CreateCurriculum';
import CreateCurriculumEdit from './Component/Mentors/CreateCurriculumEdit';
import Approved from './Component/Mentors/Approved';
import Deny from './Component/Mentors/Deny';
import EditTask from './Component/Mentors/EditTask';
import Students from './Component/Mentors/Students';
import MentorTask from './Component/Mentors/MentorTask';
import FilesUpload from './Component/Mentors/FilesUpload';
import MentorProject from './Component/Mentors/MentorProject';
import ReportMentor from './Component/Mentors/ReportMentor';
import Chats from './Component/Mentors/Chats';
import ChatsGroup from './Component/Mentors/ChatsGroup';
import MentorChats from './Component/Mentors/MentorChats';




// Affiliate Component
import Affiliatepolicy from './Component/Affiliate/Affiliatepolicy';
import Affiliateform from './Component/Affiliate/Affiliateform';
import Affiliatprofile from './Component/Affiliate/Affiliatprofile';

// Admin
import AdminLogin from './Component/Admin/AdminLogin';
import Dashboard from './Component/Admin/Dashboard';
import MentorRegisterQuestion from './Component/Admin/MentorRegisterQuestion';
import UserApproveList from './Component/Admin/UserApproveList';
import AffiliatRegisterQuestion from './Component/Admin/AffiliatRegisterQuestion';
import AffiliatApproveList from './Component/Admin/AffiliatApproveList';
import CourseApproveList from './Component/Admin/CourseApproveList';
import MentorPayment from './Component/Admin/MentorPayment';
import AffiliatePayment from './Component/Admin/AffiliatePayment';
import GenrateCertificate from './Component/Admin/GenrateCertificate';
import CourseBatches from './Component/Admin/CourseBatches';
import Reports from './Component/Admin/Reports';
import VariableControl from './Component/Admin/VariableControl';
import TemlatesCoupons from './Component/Admin/TemlatesCoupons';


const Routes = () => (
	<Router basename="">
		{ window.location.pathname.slice(1, 6) === 'admin' ? 
		<div id="wrapper">
			<Route exact path="/admin" component={AdminLogin} />
			<Route exact path="/admin/dashboard" component={Dashboard} />
			<Route path="/admin/mentorapproveques" component={MentorRegisterQuestion} />
			<Route path="/admin/uerapprovelist" component={UserApproveList} />
			<Route path="/admin/affiliatregisterquestion" component={AffiliatRegisterQuestion} />
			<Route path="/admin/affiliatapproveList" component={AffiliatApproveList} />
			<Route path="/admin/courseapprovelist" component={CourseApproveList} />
			<Route path="/admin/mentorpayment" component={MentorPayment} />
			<Route path="/admin/affiliatepayment" component={AffiliatePayment} />
			<Route path="/admin/genratecertificate" component={GenrateCertificate} />
			<Route path="/admin/coursebatches" component={CourseBatches} />
			<Route path="/admin/reports" component={Reports} />
			<Route path="/admin/variablecontrol" component={VariableControl} />
			<Route path="/admin/temlatescoupons" component={TemlatesCoupons} />
		</div>
		: 
		<div id="wrapper">
			<Header />
			<Route exact path="/mentor/:id" component={Mentors} />
			<Route path="/coursedetail/:id/:affiliat_id?" component={Coursedetail} />
			<Route path="/cart" component={Cart} />
			<Route path="/wishlist" component={Wishlist} />
			<Route path="/programs" component={Programs} />
			<Route path="/progrmcuriculm/:id" component={Curriculum} />
			<Route path="/progrmtaskicul/:courseid" component={Task} />
			<Route path="/progrmfileculu/:courseid" component={Files} />
			<Route path="/projectsubmitu/:courseid" component={Projectsubmit} />
			<Route path="/review/:courseid" component={Review} />
			<Route path="/mentorpolicy" component={Mentorpolicy} />
			<Route path="/mentorform" component={Mentorform} />
			<Route path="/affiliatepolicy" component={Affiliatepolicy} />
			<Route path="/affiliateform" component={Affiliateform} />
			<Route path="/affiliatprofile" component={Affiliatprofile} />
			<Route path="/mentorprofile" component={Mentorprofile} />
			<Route path="/createcurriculum" component={CreateCurriculum} />
			<Route path="/createcurriculumedit/:id" component={CreateCurriculumEdit} />
			<Route path="/currileaderboard/:courseid" component={CurriLeaderboard} />
			<Route path="/taskleaderboard/:courseid" component={TaskLeaderboard} />
			<Route path="/projectleaderboard/:courseid" component={ProjectLeaderboard} />
			<Route path="/certificatesub/:id" component={Certificate} />
			<Route path="/reportmentee/:courseid" component={ReportMentee} />
			<Route path="/approved" component={Approved} />
			<Route path="/deny" component={Deny} />
			<Route path="/coursepayment/:courseid" component={CoursePayment} />
			<Route path="/edittask/:id/:courseid" component={EditTask} />
			<Route path="/students/:courseid" component={Students} />
			<Route path="/mentortask/:courseid" component={MentorTask} />
			<Route path="/filesupload/:courseid" component={FilesUpload} />
			<Route path="/mentorproject/:courseid" component={MentorProject} />
			<Route path="/register/:courseid/:affiliat_id" component={Register} />
			<Route path="/coursepaymentmentee/:courseid/:affiliat_id" component={CoursePaymentMentee} />
			<Route path="/reportmentor/:courseid/" component={ReportMentor} />
			<Route path="/chats/:courseid/" component={Chats} />
			<Route path="/chatgroup/:courseid/" component={ChatsGroup} />
			<Route path="/mentorchats/:courseid/:batchid" component={MentorChats} />
			<Footer />
		</div>
		}
	</Router>
)

export default Routes;

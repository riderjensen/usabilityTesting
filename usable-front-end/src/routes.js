import UsableForm from './components/UsableForm'
import UsableHome from './components/UsableHome'
import UsableSignUp from './components/UsableSignUp'
import UsableContact from './components/UsableContact'


export const routes = [
    { path: '', component: UsableHome },
    { path: '/new-test', component: UsableForm },
    { path: '/sign-up', component: UsableSignUp },
    { path: '/contact-us', component: UsableContact }
];
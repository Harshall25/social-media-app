import {Link} from 'react-router-dom';
export function NavBar(){
    return(
        <nav>
            {/* Logo  */}
            <Link to="/" >Home</Link>
            <Link to="/feed" >Feed</Link>
            <Link to="/" >New Post</Link>
            <Link to="/Login" >Login/Register</Link>
        </nav>
    );
}

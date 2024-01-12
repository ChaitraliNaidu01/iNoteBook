import Notes from './Notes';


export const Home = (props) => {
   const {showAlert} = props;//Destructuring showAlert is being derived from props
    return (
        <div>
            <Notes showAlert={showAlert}/>
        </div>
    )
}

export default Home
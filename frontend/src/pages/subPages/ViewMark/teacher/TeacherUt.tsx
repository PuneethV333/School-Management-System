import { useState } from "react";
import { useFetchMe } from "../../../../hooks/useAuth";
import { useFetchUtMarks } from "../../../../hooks/useMarkData"
import Spinner from "../../../../components/Spinner";
import SelectClass from "../../../../components/SelectClass";

const TeacherUt = () => {
    const {data:userData,isPending:loading} = useFetchMe()
    const [classNo,setClassNo] = useState<number>(1)
    const {data:utData,isPending:loadingMarks} = useFetchUtMarks(classNo,userData)
    
    if(loading || loadingMarks){
        return <Spinner/>
    }
    
    console.log(utData);
    
    
  return (
    <div>
        <SelectClass classNo={classNo} setClassNo={setClassNo}/>
    </div>
  )
}

export default TeacherUt
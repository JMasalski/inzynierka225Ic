import React, {useEffect, useState} from 'react'

const UseDebounce = (value:string, delay:number) => {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounced(value)
        },delay)
        return () => {
            clearTimeout(handler);
        };
    },[value,delay])
    return debounced

}
export default UseDebounce

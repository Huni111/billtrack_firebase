import React, {useState, useEffect} from "react"
import data from '../data.json/'

export default function Bills() {

    const 

    const elso = data.sort((a, b) => (a.valoare_totala - b.valoare_totala)).slice(0,10)

    useEffect(() => {

        

        return(
        console.log(elso)
        )
    },[])

    return (
        <>
        <div>bills</div>

        </>

    )
}
import React, {useState, useEffect} from "react"
import data from '../data.json/'

export default function Bills() {

    const today = new Date();
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()+1
    const data_facturi = new Date(data.data_facturi)

    let elso10 = data.sort((a, b) => (a.valoare_totala - b.valoare_totala)).slice(0,10)
    let havi_bejovo = 

    useEffect(() => {


        

        return(
        console.log(data_facturi)
        )
    },[])

    return (
        <>
        <div>{data_facturi}</div>
        <div>hej</div>

        </>

    )
}
//Pedirle a la Api Los paises
//Contener a las cards que se deben ver en pantalla
import CardsElement from "../cardsElement/CardElement"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react"
import { setFilteredCountries } from "../../redux/actions";
import style from "./CardsContainer.module.css"
import { ordenAlfabeticoPaises, ordenHabitantesPaises } from "../../redux/actions";
import { ORDEN_ALFABETICO_PAISES, ORDEN_HABITANTES_PAISES } from "../../redux/action-types";
//Modularizar Filtros
//Mejorar Paginado

export default function CardsContainer() {
    // Estados de Redux
    const countries = useSelector((state => state.countries)) 
    const actividades = useSelector((state => state.activities)) 
    let countriesReserve = useSelector((state => state.countriesReserve)) 
    
    //Filtrado
    const activeFilters = useSelector(state => state.activeFilters)
    const dispatch = useDispatch()
    const {
        continents,
        activities,
        order,
        name
    } = activeFilters
    useEffect(()=>{
        console.log(countriesReserve, "holi")
        console.log(activeFilters)
        if(continents.length || activities.length || order.by || name){
            if(continents.length) {
                countriesReserve = countriesReserve.filter(country => continents.includes(country.continent))
            }  
            if(activities.length) {
                const countriesID = []
                for(let actividad of actividades) {
                    if(activities.includes(actividad.activity_id)){
                        actividad.countries.forEach(country => countriesID.push(country.id))
                    }
                }
                    countriesReserve = countriesReserve.filter(country => countriesID.includes(country.id))
            }
            console.log(countriesReserve, "chau")
            if(order.by){
                switch(order.by) {
                    case "alfabetico":
                        order.sentido ? 
                            countriesReserve = countriesReserve.sort((c1, c2) => c1.name.localeCompare(c2.name))
                         : 
                            countriesReserve = countriesReserve.sort((c1, c2) => c2.name.localeCompare(c1.name))
                    break
                    case "population":
                        order.sentido ?
                            countriesReserve = countriesReserve.sort((c1, c2) => c2.population - c1.population)
                        :
                            countriesReserve = countriesReserve.sort((c1, c2) => c1.population - c2.population)
                    break
                    default:
                    break
                }
            }
            if(name){
                countriesReserve = countriesReserve.filter(country => country.name.toUpperCase().includes(name.toUpperCase()))
            }
            dispatch(setFilteredCountries(countriesReserve))
        } else if(!name.length) {
            dispatch(setFilteredCountries(countriesReserve))
        }
    }, [activeFilters])
    
    //Paginado
    const [currentPage, setCurrentPage]= useState(0)
    const filterCountries = countries.slice(currentPage, currentPage + 10)
    const nextPage = () => {
        setCurrentPage(currentPage + 10)
    }
    const prevPage = () => {
        if (currentPage > 0)
        setCurrentPage(currentPage - 10)
    }

    const handleSelect = (event) => {
        console.log(event.target.value)
      switch(event.target.id) {
        case ORDEN_ALFABETICO_PAISES: //Este filtro se va cuando cambias de pestaña eso pasa porque toma un change del input y vuelve a hacer una request al servidor
            dispatch(ordenAlfabeticoPaises())
        break;
        case ORDEN_HABITANTES_PAISES:
            dispatch(ordenHabitantesPaises())
        break
        default:
            break
      }  
    }

    return(
        <>
            <h1 style={{"margin-block-end": "12px"}}>Lista de Paises</h1>
            <div className={style.contenedorTitulos}>
                <div className={style.nameContainer}><label className={style.name} id={ORDEN_ALFABETICO_PAISES} onClick={handleSelect}>Nombre <div className={style.flechitaFiltro}></div></label></div> 
                <div className={style.continente}><label >Continente</label></div>
                <div ><label className={style.poblacion} id={ORDEN_HABITANTES_PAISES} onClick={handleSelect} > Población <div className={style.flechitaFiltro}></div></label></div>
            </div>
            <div className={style.contenedor2Cards}>
                {filterCountries?.map(country => <CardsElement country={{...country}}/>)}
            </div>    
            <div>
            <input type="submit" onClick={prevPage} value="Página Anterior"/>
            <input type="submit" onClick={nextPage} value="Próxima Página"/>
            </div>
        </>
    )
}

import { ref, onMounted, computed } from "vue"

export default function useCripto(){

    const criptomonedas = ref([])
    const monedas = ref([
        { codigo: 'USD', texto: 'USD'},
        { codigo: 'EUR', texto: 'EUR'},
        { codigo: 'GBP', texto: 'GBP'},
    ])
    const cotizacion = ref({})
    const cargando = ref(false)


    onMounted(() => {
        const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
        //Al usar fetch, usar 2 then, primero conexion y segundo datos
        fetch(url)
            .then(respuesta => respuesta.json()) 
            .then(({Data}) => { // ({Data}) por medio de destructuring, es igual a hacer data.Data, la API requiere el Data            
                criptomonedas.value = (Data[0].CoinInfo.Name === 'ORCA') ? Data[0].pop() : Data
            })
    })

    const obtenerCotizacion = async(cotizar) => {
        cargando.value = true
        cotizacion.value={}
        const { moneda, criptomoneda} = cotizar
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    
        const respuesta = await fetch(url)
        const data = await respuesta.json();
        cotizacion.value = data.DISPLAY[criptomoneda][moneda]
        cargando.value = false
      }
    const mostrarResultado = computed(() => {
        return Object.values(cotizacion.value).length > 0
    })

    return {
        monedas,
        criptomonedas,
        cargando,
        cotizacion,
        obtenerCotizacion,
        mostrarResultado
    }
}
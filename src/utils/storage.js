const STORAGE_KEY = 'expenses_data'

export function loadExpenses(){
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error("failed to load expenses: ", error)
    }
}

export function saveExpenses(data){
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
        console.error("Failed to save data:",error)
    }
}
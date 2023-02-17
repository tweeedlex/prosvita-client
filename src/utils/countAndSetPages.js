export const countAndSetPages = (response, setPages, limit) => {
    const pageNumber = Math.ceil(+response.data.count / (limit || 20))
    let p = []
    for (let i = 1; i <= pageNumber; i++) {
      p.push(i)
    }
    setPages(p)
}
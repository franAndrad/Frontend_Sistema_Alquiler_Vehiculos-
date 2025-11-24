/**
 * Sincroniza los anchos de las columnas del header y body cuando están en tablas separadas
 */
export function syncTableColumns() {
  const containers = document.querySelectorAll('.table-container')
  
  containers.forEach((container) => {
    const headerWrapper = container.querySelector('.table-header-wrapper')
    const bodyWrapper = container.querySelector('.table-body-wrapper')
    
    if (!headerWrapper || !bodyWrapper) return
    
    const headerTable = headerWrapper.querySelector('.table')
    const bodyTable = bodyWrapper.querySelector('.table')
    
    if (!headerTable || !bodyTable) return
    
    const headerCells = Array.from(headerTable.querySelectorAll('th'))
    const firstRow = bodyTable.querySelector('tbody tr')
    
    if (!firstRow) return
    
    const bodyCells = Array.from(firstRow.querySelectorAll('td'))
    
    if (headerCells.length !== bodyCells.length) return
    
    // Asegurar table-layout: fixed
    headerTable.style.tableLayout = 'fixed'
    bodyTable.style.tableLayout = 'fixed'
    
    // Obtener el ancho disponible del contenedor
    const containerWidth = container.getBoundingClientRect().width
    
    // Resetear todos los anchos primero
    headerCells.forEach((th) => {
      th.style.width = ''
      th.style.minWidth = ''
      th.style.maxWidth = ''
    })
    bodyCells.forEach((td) => {
      td.style.width = ''
      td.style.minWidth = ''
      td.style.maxWidth = ''
    })
    
    // Forzar reflow
    void container.offsetHeight
    void bodyTable.offsetHeight
    void headerTable.offsetHeight
    
    // Establecer el ancho de las tablas al 100% del contenedor
    headerTable.style.width = '100%'
    bodyTable.style.width = '100%'
    
    // Calcular el ancho disponible (restando el scrollbar si existe)
    const bodyWrapperWidth = bodyWrapper.getBoundingClientRect().width
    const availableWidth = bodyWrapperWidth > 0 ? bodyWrapperWidth : containerWidth
    
    // Calcular anchos proporcionales basados en el contenido mínimo
    const minWidths = bodyCells.map((td) => {
      // Resetear para obtener el ancho mínimo natural
      const originalWidth = td.style.width
      td.style.width = 'auto'
      const minWidth = td.scrollWidth
      td.style.width = originalWidth
      return Math.max(minWidth, 80) // Mínimo 80px por columna
    })
    
    const totalMinWidth = minWidths.reduce((sum, w) => sum + w, 0)
    
    // Si el contenido mínimo es menor que el ancho disponible, distribuir el espacio extra
    let widths
    if (totalMinWidth < availableWidth) {
      // Distribuir proporcionalmente el espacio extra
      const extraSpace = availableWidth - totalMinWidth
      const totalMin = minWidths.reduce((sum, w) => sum + w, 0)
      widths = minWidths.map((minW) => {
        const proportion = minW / totalMin
        return minW + (extraSpace * proportion)
      })
    } else {
      // Usar los anchos mínimos
      widths = minWidths
    }
    
    // Asegurar que la suma sea exactamente el ancho disponible
    const totalWidth = widths.reduce((sum, w) => sum + w, 0)
    if (totalWidth !== availableWidth) {
      const ratio = availableWidth / totalWidth
      widths = widths.map(w => w * ratio)
    }
    
    // Aplicar los anchos al header
    headerCells.forEach((th, index) => {
      if (widths[index] !== undefined) {
        const width = widths[index]
        th.style.width = `${width}px`
        th.style.minWidth = `${width}px`
        th.style.maxWidth = `${width}px`
      }
    })
    
    // Aplicar los mismos anchos al body para mantener consistencia
    const allBodyRows = bodyTable.querySelectorAll('tbody tr')
    allBodyRows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td'))
      cells.forEach((td, index) => {
        if (widths[index] !== undefined) {
          const width = widths[index]
          td.style.width = `${width}px`
          td.style.minWidth = `${width}px`
        }
      })
    })
  })
}

// Ejecutar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  // Ejecutar inmediatamente
  setTimeout(syncTableColumns, 0)
  
  // Ejecutar después de que se cargue la página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncTableColumns)
  } else {
    syncTableColumns()
  }
  
  // Ejecutar cuando cambie el tamaño de la ventana
  window.addEventListener('resize', () => {
    setTimeout(syncTableColumns, 100)
  })
}


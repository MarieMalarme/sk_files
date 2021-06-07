import { useEffect, useState } from 'react'

const App = () => {
  const [data, set_data] = useState(null)

  useEffect(() => {
    get_data(set_data)
  }, [])

  const json_export = JSON.stringify(data, null, '\t')

  return (
    <div>
      <div>SK Files</div>
      <div className="light">Dataset of serial killers</div>
      {!data && <div>Loading data...</div>}
      {data && (
        <a
          href={`data: text/json;charset=utf-8, ${json_export}`}
          download="sk_files.json"
        >
          <button className="bold">sk_files.json</button>
        </a>
      )}
    </div>
  )
}

const wikipedia_api_url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=`
const sk_list_page = `List_of_serial_killers_by_number_of_victims`

const get_data = async (set_data) => {
  const response = await fetch(`${wikipedia_api_url}${sk_list_page}`)
  const data = await response.json()
  if (!data) return

  const html_code = data['parse']['text']['*']
  const parser = new DOMParser()
  const html = parser.parseFromString(html_code, 'text/html')

  // access the several tables & headlines of the wikipedia article
  const tables = [...html.querySelectorAll('.wikitable')]
  const headlines = [...html.querySelectorAll('.mw-headline')]
  const table_titles = headlines.slice(0, tables.length)

  // parse the html tables & flatten all the rows in one array
  const rows = tables
    .map((table, table_index) => {
      // access the html tbody element of the table
      // <table><tbody>...</tbody></table>
      const tbody = [...table.children][0]
      // access the html rows elements in the tbody of the table
      // remove the first row of each table, which is the header with column titles
      const rows = [...tbody.children].slice(1)
      // define each row as an object with the table it comes from & the columns content
      return rows.map((row) => ({
        table: table_titles[table_index].textContent,
        columns: [...row.children],
      }))
    })
    .flat()

  // convert the html table elements into an array of objects - one for each serial killer
  const killers = rows.map(({ table, columns }) => {
    const href = columns[0].children[0]?.attributes[0]?.value
    return {
      name: columns[0].textContent.trim(),
      countries: to_countries_array(columns[1]),
      active_years: to_numbers_array(columns[2].textContent),
      proven_victims: to_numbers_array(columns[3].textContent),
      possible_victims: to_numbers_array(columns[4].textContent),
      notes: columns[5].textContent.replaceAll(/\[.*?\]/g, '').trim(), // remove the footnotes anchors & whitespaces
      status: table.match(/disputed/i) ? 'disputed' : 'proven',
      organisation: table.match(/group/i) ? 'group' : 'solo',
      medical_professional: table.match(/medical/i) !== null,
      wikipedia_article_url: href && `https://en.wikipedia.org${href}`,
    }
  })

  // set the state with the serial killers list
  set_data(killers)
}

const to_numbers_array = (string) =>
  string
    .trim()
    // remove the footnotes anchors with a regex matching anything between square brackets
    // example: "25[203][204]" → "25"
    .replaceAll(/\[.*?\]/g, '')
    // split on separators to get numbers: ' to ' for dates, '-' or '–' for victims
    // example for dates: "1950 to 1960" → ["1950", "1960"]
    // example for victims: "30-40" → ["30", "40"]
    .split(/ to |[-–]/g)
    // only store numbers: remove non-numeric values & convert to number
    // example 1: "30+" → 30
    // example 2: "~10" → 10
    .map((d) => d && Number(d.replace(/[^0-9]/g, '')))

const to_countries_array = (html_column) => {
  let n
  // extract all the text nodes from the html_column element tree
  const text_nodes = []
  const walk = document.createTreeWalker(html_column, NodeFilter.SHOW_TEXT)
  while ((n = walk.nextNode())) text_nodes.push(n)

  return (
    text_nodes
      .filter(({ textContent }) => {
        // only keep nodes that contain country names: not empty & which first character is uppercase
        // example:[" ", "Colombia", " ", "Ecuador (suspected)", "[3]", "\n"] → ["Colombia", "Ecuador (suspected)"]
        return /\S/.test(textContent) && textContent[0].match(/[A-Z]/)
      })
      // keep only country names: remove "(suspected)" occurences and whitespaces
      // example: ["Colombia", "Ecuador (suspected)"] → ["Colombia", "Ecuador"]
      .map(({ textContent }) =>
        textContent.replaceAll('(suspected)', '').trim(),
      )
  )
}

export default App

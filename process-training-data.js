const PROCESS_TRAINING_DATA = {
  '3': { processes: [], pitProcesses: [], onsite: false },
  'natdrata': { processes: ['Dock', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'mshafaqh': { processes: ['Receive', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'harnekse': { processes: ['Pack', 'Ship', 'VRC', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'saattaie': { processes: ['Pick', 'Pack', 'Sort', 'VRC', 'Manual Slam', 'Auto Slam', 'Waterspider'], pitProcesses: [], onsite: false },
  'nammande': { processes: ['Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'rupanixb': { processes: ['Ship'], pitProcesses: [], onsite: false },
  'margmehr': { processes: ['Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: true },
  'chowdhib': { processes: ['Receive', 'Stow', 'Pick', 'Prep'], pitProcesses: [], onsite: true },
  'basrezae': { processes: ['Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'matalma': { processes: ['Pack'], pitProcesses: [], onsite: false },
  'obirdkyl': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'yussimus': { processes: ['Pick', 'Pack', 'VRET Pack', 'VRC'], pitProcesses: [], onsite: false },
  'manaizah': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'makendir': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'jkamanve': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'fsafdari': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: true },
  'mitmanju': { processes: ['Stow', 'IB PS'], pitProcesses: [], onsite: false },
  'bhattilw': { processes: ['Receive', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'nithlamw': { processes: ['Pick', 'Pack', 'VRC', 'KPP', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'bjawandh': { processes: ['Receive', 'Stow', 'IB PS', 'Prep'], pitProcesses: [], onsite: false },
  'wasibtai': { processes: ['Pick', 'Pack', 'Ship', 'OB PS', 'VRET Pack', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'ynesharm': { processes: ['Pick', 'Pack', 'Sort', 'OB PS', 'VRC', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'haizarar': { processes: ['SBC', 'CC', 'SRC', 'Pick'], pitProcesses: [], onsite: false },
  'irahaida': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'asehashi': { processes: ['Stow', 'Pick', 'Pack', 'VRC', 'KPP', 'Manual Slam', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'samiqasi': { processes: ['Pack'], pitProcesses: [], onsite: false },
  'teranwen': { processes: ['Stow', 'Pick', 'Ship'], pitProcesses: [], onsite: false },
  'marimolc': { processes: ['Receive', 'Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'brdkng': { processes: ['Dock', 'Stow', 'IB PS', 'Pick'], pitProcesses: [], onsite: false },
  'gamimanz': { processes: ['SBC', 'CC', 'Ship'], pitProcesses: [], onsite: false },
  'chhunlen': { processes: ['Pick', 'Pack', 'OB PS', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'shavkari': { processes: ['Dock'], pitProcesses: [], onsite: false },
  'jdonoand': { processes: ['Stow', 'Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'ttarinah': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'akbarroh': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: true },
  'dulanith': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'attahmad': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'webbrrob': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'cofepule': { processes: ['Pick', 'Sort', 'Ship', 'OB PS', 'VRC'], pitProcesses: [], onsite: false },
  'gfaisalk': { processes: ['Pick', 'Sort'], pitProcesses: [], onsite: true },
  'hanifare': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'jmomuh': { processes: ['Stow', 'Pack', 'VRC', 'Waterspider'], pitProcesses: [], onsite: false },
  'jamcorma': { processes: ['SBC', 'CC', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'felemnag': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'sharvalq': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'lloydcel': { processes: ['Pick', 'Pack', 'Sort', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'zaktmert': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'deligena': { processes: ['SBC', 'CC', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'sanchayr': { processes: ['Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'madeepas': { processes: ['Pick', 'Pack', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'kekiyuma': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'josetung': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: true },
  'ludarief': { processes: [], pitProcesses: [], onsite: true },
  'tarnttho': { processes: ['SBC', 'CC', 'SRC', 'Pick', 'Pack'], pitProcesses: [], onsite: false },
  'thdeepth': { processes: ['Receive', 'Stow', 'IB PS', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'cwilsshe': { processes: ['SBC', 'CC', 'SRC', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'nmackene': { processes: ['Pick', 'VRC'], pitProcesses: [], onsite: false },
  'lukfeng': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'xavixavg': { processes: ['Pack', 'Ship'], pitProcesses: [], onsite: false },
  'mahrukba': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'gtruphin': { processes: ['Dock', 'Stow', 'Pick', 'Pack', 'Sort', 'VRC', 'KPP'], pitProcesses: [], onsite: false },
  'foladial': { processes: ['Receive', 'Stow', 'Pick', 'Prep'], pitProcesses: [], onsite: false },
  'mccashne': { processes: ['Receive', 'Stow', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'montberr': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'yvetteno': { processes: ['Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'imalkits': { processes: ['Pack', 'Waterspider'], pitProcesses: [], onsite: false },
  'obwdamir': { processes: ['Receive', 'Stow', 'Pack', 'Cubiscan'], pitProcesses: [], onsite: false },
  'lvuthai': { processes: ['KPP'], pitProcesses: [], onsite: false },
  'cuodonog': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'conbular': { processes: ['Dock', 'Receive', 'Stow', 'VRC', 'Cubiscan'], pitProcesses: [], onsite: false },
  'memmehak': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'skamaaum': { processes: ['Receive', 'Stow', 'Pack', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'jitalavi': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'richclai': { processes: ['Stow', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'alisinax': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'billlinl': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'wahisalo': { processes: ['Receive', 'Stow', 'IB PS', 'Pick', 'Cubiscan'], pitProcesses: [], onsite: false },
  'ddenayen': { processes: ['Pack', 'Ship'], pitProcesses: [], onsite: false },
  'hashjroh': { processes: ['Pick', 'Pack', 'Waterspider'], pitProcesses: [], onsite: false },
  'grimwd': { processes: ['Pick', 'Ship', 'VRET Pack', 'VRC'], pitProcesses: [], onsite: false },
  'novenora': { processes: ['Pick', 'Pack', 'OB PS', 'Manual Slam', 'Waterspider'], pitProcesses: [], onsite: false },
  'joelwith': { processes: ['Stow', 'Pack', 'VRC', 'Waterspider'], pitProcesses: [], onsite: false },
  'franchoo': { processes: ['Dock', 'Receive', 'Stow', 'Sort', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'nixobbit': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'kishbaig': { processes: ['Dock', 'Receive', 'Stow', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'camfjack': { processes: ['Pack', 'Waterspider'], pitProcesses: [], onsite: false },
  'sfatimap': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'sanhohar': { processes: ['SBC', 'SRC', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'roopran': { processes: ['Dock', 'Receive', 'Stow', 'Pick', 'VRC', 'KPP', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'krysinga': { processes: ['Pick', 'VRC'], pitProcesses: [], onsite: false },
  'yuhsua': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'Pack', 'OB PS', 'Prep'], pitProcesses: [], onsite: false },
  'prasalkr': { processes: ['Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: true },
  'mortezka': { processes: ['Pack', 'Ship', 'Waterspider'], pitProcesses: [], onsite: true },
  'uswahmed': { processes: ['Receive', 'Pack'], pitProcesses: [], onsite: false },
  'raziaqas': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'hakimasu': { processes: ['Receive', 'Stow', 'Pick', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: true },
  'tekattyr': { processes: ['Stow', 'VRC'], pitProcesses: [], onsite: false },
  'abrahkme': { processes: ['Pick', 'Pack', 'VRC', 'KPP', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'rikenpak': { processes: ['Stow', 'Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: true },
  'jeanchoy': { processes: ['Receive', 'Stow', 'Pick'], pitProcesses: [], onsite: true },
  'faqurban': { processes: ['Receive', 'Stow'], pitProcesses: [], onsite: false },
  'camortim': { processes: ['Stow', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'jafroqiv': { processes: ['SBC', 'CC', 'SRC', 'Stow', 'Pack', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'zamsyed': { processes: ['RSR', 'Dock', 'Receive', 'Stow', 'IB PS'], pitProcesses: [], onsite: false },
  'uanesbed': { processes: ['Receive', 'Stow', 'Pick', 'Prep'], pitProcesses: [], onsite: false },
  'dgguglie': { processes: ['Pick', 'Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'jyordo': { processes: ['VRC'], pitProcesses: [], onsite: false },
  'reznarji': { processes: ['Receive', 'Stow', 'Pick', 'Prep'], pitProcesses: [], onsite: false },
  'ozadrana': { processes: ['Receive', 'Stow', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'rahueame': { processes: ['Pick', 'Pack', 'VRC', 'Waterspider'], pitProcesses: [], onsite: false },
  'nandakrj': { processes: ['Pack', 'Sort', 'VRC', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'panestar': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'slovkaur': { processes: ['Pick', 'Pack', 'Sort', 'VRET Pack', 'VRC'], pitProcesses: [], onsite: false },
  'bhashemi': { processes: ['Pick', 'Pack', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'tfilipkr': { processes: ['Dock', 'Receive', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'kkeawill': { processes: ['Pick', 'Pack', 'Ship', 'OB PS', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'jamilimc': { processes: ['Pick', 'Pack', 'VRC', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'mrahimio': { processes: ['Pick', 'Pack', 'VRET Pack', 'KPP', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'kaygurwi': { processes: ['Pick', 'Pack', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'kanivale': { processes: ['Dock', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'marzbibi': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'aruzxehs': { processes: ['Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'ssarbsin': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: true },
  'zdfayazi': { processes: ['Stow', 'Pack', 'VRC', 'KPP'], pitProcesses: [], onsite: false },
  'gcdip': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'baldersi': { processes: ['Receive', 'Stow', 'VRC', 'Prep'], pitProcesses: [], onsite: true },
  'danaoama': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'simagusu': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'hpnazari': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'najasaim': { processes: ['Receive', 'Stow', 'Prep'], pitProcesses: [], onsite: false },
  'wanjonas': { processes: ['Receive', 'Stow', 'Pick'], pitProcesses: [], onsite: false },
  'rsitaro': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'dylanxw': { processes: ['Pack', 'KPP', 'Manual Slam'], pitProcesses: [], onsite: false },
  'svharjee': { processes: ['Dock', 'Stow', 'Pick'], pitProcesses: [], onsite: false },
  'ahaidern': { processes: ['Dock', 'Receive', 'Stow', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'sullailu': { processes: ['Pack', 'VRET Pack', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'abbasany': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'celischr': { processes: ['Pick', 'Pack', 'Sort', 'OB PS', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'hakdshah': { processes: ['Pick', 'Pack', 'Auto Slam', 'Waterspider'], pitProcesses: [], onsite: false },
  'crebekaj': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'almeijet': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'nrapunze': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'qdoanxua': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'OB PS', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'irojones': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'husskaiz': { processes: ['SBC', 'CC', 'SRC', 'Pack', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'shafienl': { processes: ['Pick', 'Pack', 'Sort', 'Manual Slam'], pitProcesses: [], onsite: false },
  'ishamsin': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'milsamad': { processes: ['Pack', 'Ship', 'VRC', 'Waterspider'], pitProcesses: [], onsite: false },
  'gadetakh': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'denpdeng': { processes: ['Pack'], pitProcesses: [], onsite: false },
  'kertapar': { processes: ['Dock', 'Receive', 'Stow', 'Prep'], pitProcesses: [], onsite: false },
  'vatamich': { processes: ['Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'gopiypat': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'xavielay': { processes: ['Pick', 'Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: true },
  'diransax': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'catuluga': { processes: ['Pick', 'Pack', 'Sort', 'OB PS', 'VRET Pack', 'VRC', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'maoaliza': { processes: ['Stow', 'Pack', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'maryjdoc': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'bbsadimu': { processes: ['SRC', 'Receive', 'Stow'], pitProcesses: [], onsite: false },
  'sulzulfl': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: true },
  'saforezv': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'voblinh': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'rahimfae': { processes: ['Receive', 'Stow'], pitProcesses: [], onsite: false },
  'uadityap': { processes: ['Pick', 'Pack', 'Ship', 'VRC'], pitProcesses: [], onsite: true },
  'kaidowli': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'kpatlias': { processes: ['Receive', 'Stow', 'IB PS', 'Pick', 'Prep'], pitProcesses: [], onsite: false },
  'eleedoan': { processes: ['Pick', 'Pack', 'Sort', 'VRC', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'fayafari': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'vadilrhi': { processes: ['Receive', 'Stow'], pitProcesses: [], onsite: false },
  'hazarama': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'apurvx': { processes: ['Receive', 'Stow', 'IB PS'], pitProcesses: [], onsite: false },
  'mbintomp': { processes: ['Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'antzahre': { processes: ['Receive'], pitProcesses: [], onsite: false },
  'timcuria': { processes: ['Pick', 'Sort'], pitProcesses: [], onsite: false },
  'nidimasi': { processes: ['Pack', 'Sort', 'VRC', 'KPP', 'Manual Slam', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'joseahen': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'nellyvw': { processes: ['Receive', 'Stow', 'Pick', 'Pack', 'Sort', 'OB PS', 'VRC', 'KPP', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'najibara': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: true },
  'sauelese': { processes: ['Pick', 'Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'kapigoun': { processes: ['Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'pnutnunt': { processes: ['SBC', 'CC', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'fgsalima': { processes: ['SBC', 'SRC', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'kiwjimmi': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'roymusta': { processes: ['Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: true },
  'srmadduk': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'fstbuckm': { processes: ['Pick', 'Sort'], pitProcesses: [], onsite: false },
  'stheresb': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'gqaishuj': { processes: ['Pick', 'Pack', 'Ship', 'VRET Pack', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'eformarc': { processes: ['Dock', 'Receive', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'hazabaid': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'ahmesesa': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'kavtapas': { processes: ['Pick', 'Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'gidluong': { processes: ['SBC', 'CC', 'SRC', 'Dock', 'Receive', 'Stow', 'IB PS', 'Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'VRET Pack', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'gemojeff': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'cholloni': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'shecraje': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'charpoku': { processes: [], pitProcesses: [], onsite: false },
  'carsenen': { processes: ['Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'akuahmed': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'prajqkal': { processes: ['Receive', 'Stow', 'Pack', 'KPP', 'Prep'], pitProcesses: [], onsite: false },
  'naqeeh': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'taraeina': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'thiphngu': { processes: ['Pick', 'Pack', 'Sort', 'OB PS', 'VRC', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'sataraha': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'yusrsarf': { processes: ['SBC', 'CC', 'Pack', 'KPP', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'taiaaron': { processes: ['Ship'], pitProcesses: [], onsite: false },
  'rlesatel': { processes: ['Stow', 'Pack', 'Sort', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'heatayla': { processes: ['Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'VRET Pack', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'nprabhlp': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'shekebaw': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'shejacku': { processes: ['SBC', 'CC', 'SRC', 'Stow'], pitProcesses: [], onsite: false },
  'rahimitu': { processes: ['SBC', 'CC', 'SRC', 'Pick', 'Pack', 'KPP'], pitProcesses: [], onsite: false },
  'mohadisa': { processes: ['Stow', 'Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: true },
  'yetsabgo': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'VRC', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'bibimoms': { processes: ['Pack', 'Ship'], pitProcesses: [], onsite: false },
  'bhavbood': { processes: ['Stow', 'Pick', 'Pack', 'Ship', 'OB PS', 'VRC'], pitProcesses: [], onsite: false },
  'ubarrosd': { processes: ['Receive', 'VRC'], pitProcesses: [], onsite: false },
  'akhmurta': { processes: ['Dock', 'Pack'], pitProcesses: [], onsite: false },
  'sulumaup': { processes: ['Receive', 'Pack', 'Sort'], pitProcesses: [], onsite: false },
  'tauauini': { processes: ['Stow', 'Pack'], pitProcesses: [], onsite: true },
  'nadirahf': { processes: ['Pick', 'Pack', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'yawarial': { processes: ['SBC', 'CC', 'Pick'], pitProcesses: [], onsite: false },
  'nadiashu': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'laritait': { processes: ['Pick', 'Pack', 'Sort', 'OB PS', 'VRET Pack', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'shoukatc': { processes: ['Stow', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'hpierced': { processes: ['Pick', 'VRC'], pitProcesses: [], onsite: false },
  'pierakif': { processes: ['Dock', 'Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'ihirprab': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: true },
  'khacahma': { processes: ['Pick', 'Sort', 'Ship'], pitProcesses: [], onsite: false },
  'vaisilii': { processes: ['Receive', 'Stow', 'IB PS', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'vhettiwe': { processes: ['Pick', 'Pack', 'Ship', 'OB PS', 'Waterspider'], pitProcesses: [], onsite: true },
  'haferoza': { processes: ['Receive', 'Stow', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'garclint': { processes: ['Pick', 'Pack', 'Sort', 'OB PS', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'mthitran': { processes: ['Stow', 'Pack', 'VRET Pack', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'madhuaro': { processes: ['Pack'], pitProcesses: [], onsite: false },
  'hormnarv': { processes: ['Pick', 'Pack', 'Sort', 'OB PS', 'VRC', 'KPP', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'muttij': { processes: ['RSR', 'Dock', 'Receive', 'Stow', 'Ship', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'rowrichn': { processes: ['Receive'], pitProcesses: [], onsite: false },
  'tanpatef': { processes: ['Pick', 'Pack', 'KPP'], pitProcesses: [], onsite: true },
  'mosaebib': { processes: ['Stow', 'Pack'], pitProcesses: [], onsite: false },
  'hukuisea': { processes: ['Dock', 'Stow', 'Ship'], pitProcesses: [], onsite: true },
  'sunhlee': { processes: ['Stow', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'lmorroro': { processes: ['Pick', 'OB PS', 'VRC'], pitProcesses: [], onsite: true },
  'lisraymo': { processes: ['Stow', 'Pick', 'Pack', 'Ship', 'VRC', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'devjibsu': { processes: ['Stow', 'Ship'], pitProcesses: [], onsite: false },
  'oldaker': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'OB PS', 'VRC', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'fasayhha': { processes: ['SBC', 'CC', 'SRC', 'Stow', 'IB PS', 'Pick', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'guaricat': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'bemretti': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'abbasual': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'rezmahew': { processes: ['SBC', 'SRC', 'Receive', 'Stow'], pitProcesses: [], onsite: false },
  'salimmun': { processes: ['Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'kiddbrac': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'hzeyadul': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'souyln': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'khanjhas': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'hliwjake': { processes: [], pitProcesses: [], onsite: false },
  'naimeena': { processes: ['Receive', 'Pick'], pitProcesses: [], onsite: false },
  'bhreejan': { processes: ['Pick', 'VRC'], pitProcesses: [], onsite: false },
  'pauljavi': { processes: ['Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'VRET Pack', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam'], pitProcesses: [], onsite: false },
  'suona': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'amidimra': { processes: ['Stow', 'Pick', 'Ship'], pitProcesses: [], onsite: false },
  'soleayou': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'mohuamal': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'saimhahm': { processes: ['Receive', 'Stow', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'alvarerb': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'johnarul': { processes: ['Ship'], pitProcesses: [], onsite: false },
  'chesimo': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'Pick', 'OB PS', 'Prep'], pitProcesses: [], onsite: false },
  'manpkv': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'gurnazsi': { processes: ['Pick', 'Ship', 'OB PS', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'jahmasoo': { processes: ['Pick', 'Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'nrosetam': { processes: ['Pack', 'Ship', 'OB PS', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: true },
  'hadiajha': { processes: ['Receive', 'Stow', 'Pick'], pitProcesses: [], onsite: false },
  'maghsra': { processes: ['Pick', 'Pack', 'Sort', 'Waterspider'], pitProcesses: [], onsite: false },
  'obaijafw': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'sheakbaj': { processes: ['Pick', 'Pack', 'VRC', 'KPP'], pitProcesses: [], onsite: true },
  'jjashall': { processes: ['KPP'], pitProcesses: [], onsite: false },
  'rmakwani': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'gurpsiu': { processes: [], pitProcesses: [], onsite: false },
  'voigtzab': { processes: ['VRC'], pitProcesses: [], onsite: false },
  'nauvcski': { processes: ['Pick', 'Pack', 'OB PS', 'VRC', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'kyleehen': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'rehmpabd': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'bgbrendo': { processes: ['SBC', 'CC', 'Receive', 'Stow'], pitProcesses: [], onsite: false },
  'sabirnow': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'djoaolay': { processes: ['SBC', 'Receive', 'Stow', 'IB PS', 'Ship', 'VRC', 'Prep'], pitProcesses: [], onsite: true },
  'moniquix': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'veerpayk': { processes: ['Pack', 'Sort'], pitProcesses: [], onsite: false },
  'kuwarsiu': { processes: ['Stow', 'Pick', 'Sort'], pitProcesses: [], onsite: false },
  'uaqurban': { processes: ['Stow', 'Pack'], pitProcesses: [], onsite: false },
  'kipyeall': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'sajitelq': { processes: ['Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'abhisava': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'fatekong': { processes: ['Receive', 'Stow'], pitProcesses: [], onsite: false },
  'jweiteri': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'micjessm': { processes: ['Pick', 'Pack', 'VRC', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'ferokhal': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'wdhijasv': { processes: ['Receive', 'Stow', 'IB PS', 'Pick'], pitProcesses: [], onsite: false },
  'richhewi': { processes: ['VRC'], pitProcesses: [], onsite: false },
  'shambahh': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'pnicknic': { processes: ['Stow', 'VRC'], pitProcesses: [], onsite: false },
  'bacuesta': { processes: ['Pack', 'Sort'], pitProcesses: [], onsite: false },
  'jkaurmnz': { processes: ['Dock', 'Receive', 'Stow', 'Pick', 'Pack', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'jhussari': { processes: ['KPP'], pitProcesses: [], onsite: true },
  'musavrad': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'caslemax': { processes: ['Receive', 'Stow'], pitProcesses: [], onsite: false },
  'sineadwi': { processes: ['Receive', 'Pick', 'Pack'], pitProcesses: [], onsite: false },
  'nkarimak': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'shavnirm': { processes: ['Pack', 'OB PS', 'KPP', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'asgkobra': { processes: ['Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'vadsreel': { processes: ['SBC', 'CC', 'Pick', 'Pack', 'Sort', 'Ship', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'manetmee': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'swsamals': { processes: ['SBC', 'CC', 'SRC', 'Pack', 'Sort', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'mingqzha': { processes: ['Stow', 'Pick', 'Pack', 'Ship', 'OB PS', 'VRC', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'vmkaur': { processes: ['Pick'], pitProcesses: [], onsite: true },
  'magampit': { processes: ['Receive'], pitProcesses: [], onsite: false },
  'saryakh': { processes: ['Pack', 'OB PS', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'alizadfg': { processes: ['Dock', 'Stow', 'Pick', 'Prep'], pitProcesses: [], onsite: false },
  'longik': { processes: ['Pick', 'Pack', 'OB PS', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'manhiema': { processes: ['Ship'], pitProcesses: [], onsite: false },
  'melserbe': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'serbsali': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'nailzmus': { processes: ['Receive', 'Stow', 'Pick', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'totimahm': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: true },
  'nasqzaka': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: true },
  'dbaujame': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'wlewjade': { processes: ['Receive', 'Stow', 'Pick', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'prahishe': { processes: ['Receive', 'Stow', 'Pick', 'VRC', 'Cubiscan'], pitProcesses: [], onsite: false },
  'ucoboswe': { processes: ['Receive', 'Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'sixterry': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'gwijenay': { processes: ['Pick', 'VRC'], pitProcesses: [], onsite: false },
  'sebatooi': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'karifabb': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: true },
  'abatoolj': { processes: ['Receive', 'Stow', 'Pick', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'abkapart': { processes: ['RSR', 'Dock', 'Receive', 'Stow', 'IB PS', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'afzalmad': { processes: ['Receive', 'Stow', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'pemmanud': { processes: ['Dock', 'Receive', 'Stow', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'admirzae': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'qgauarna': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'ozraaska': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'hbshamsu': { processes: ['Pack', 'Waterspider'], pitProcesses: [], onsite: false },
  'nikpavlo': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'casgropp': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'ehhazrat': { processes: ['Pick', 'VRC'], pitProcesses: [], onsite: false },
  'patvhard': { processes: ['Pack', 'Sort', 'Ship', 'VRC', 'Manual Slam', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'qumbriir': { processes: ['Stow', 'Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'bhaushar': { processes: ['Sort', 'OB PS', 'VRET Pack', 'VRC', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'budianb': { processes: ['SRC', 'Receive', 'Stow', 'Pack', 'Prep'], pitProcesses: [], onsite: false },
  'mehalmod': { processes: ['Pick', 'Pack', 'VRET Pack', 'VRC'], pitProcesses: [], onsite: false },
  'zsajji': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'yagtipen': { processes: ['Pack', 'Sort', 'Ship', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'anchungk': { processes: ['Receive', 'Stow', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'falleyla': { processes: ['Dock', 'Receive', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'kranawee': { processes: ['Pick', 'Pack', 'Manual Slam', 'Waterspider'], pitProcesses: [], onsite: false },
  'ukellydy': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'trssorav': { processes: ['Pack', 'Ship', 'VRET Pack', 'KPP'], pitProcesses: [], onsite: false },
  'nargeshu': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'ysheenhu': { processes: ['Pick', 'Pack', 'VRC', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'mattksta': { processes: ['Pick', 'Sort'], pitProcesses: [], onsite: false },
  'navneemk': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'vlayjosh': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'abumuhai': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'elimaris': { processes: ['Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'VRET Pack', 'VRC', 'Manual Slam'], pitProcesses: [], onsite: false },
  'tomicivk': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'repfatem': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: true },
  'obibabha': { processes: ['Pick', 'Sort', 'Ship'], pitProcesses: [], onsite: false },
  'pumercyl': { processes: ['Stow', 'Pack', 'VRC', 'Waterspider'], pitProcesses: [], onsite: true },
  'irsibrah': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'attayeex': { processes: ['Receive', 'Stow'], pitProcesses: [], onsite: false },
  'rezaiemj': { processes: ['Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: true },
  'lsathiym': { processes: ['Pick'], pitProcesses: [], onsite: true },
  'nipgehge': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'ypsunilk': { processes: ['SBC', 'CC', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'xausafah': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'mahmpmin': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: true },
  'ryzdana': { processes: ['Pick', 'Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'batosani': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'codpinon': { processes: ['Pack', 'VRC', 'Manual Slam'], pitProcesses: [], onsite: false },
  'ushamina': { processes: ['Receive', 'Stow', 'Pack', 'Prep'], pitProcesses: [], onsite: false },
  'ciftikha': { processes: ['Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'aalimish': { processes: ['Pick', 'Pack', 'VRET Pack', 'VRC', 'KPP', 'Waterspider'], pitProcesses: [], onsite: false },
  'ahmadrmo': { processes: ['Pick'], pitProcesses: [], onsite: true },
  'mikailwa': { processes: [], pitProcesses: [], onsite: false },
  'guilalla': { processes: ['Pick', 'Pack', 'Sort', 'OB PS', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'pawandlk': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'alitupay': { processes: ['Dock', 'Receive', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'ferza': { processes: ['KPP'], pitProcesses: [], onsite: false },
  'nazayasi': { processes: ['Receive', 'Stow', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'victpun': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: true },
  'askahali': { processes: ['SBC', 'CC', 'Stow'], pitProcesses: [], onsite: false },
  'obasital': { processes: ['Receive', 'Stow', 'Pick'], pitProcesses: [], onsite: false },
  'batsasma': { processes: ['Pick', 'Pack', 'VRET Pack', 'KPP'], pitProcesses: [], onsite: false },
  'ufizaidi': { processes: ['Pick', 'Pack', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'mhamsami': { processes: ['SBC', 'CC', 'Receive', 'Pack'], pitProcesses: [], onsite: false },
  'afykhanu': { processes: ['Pack', 'Ship'], pitProcesses: [], onsite: false },
  'dwisemke': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'kkaswaln': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: true },
  'dmubeenp': { processes: ['Receive', 'Stow', 'IB PS', 'VRC', 'Cubiscan'], pitProcesses: [], onsite: false },
  'tisescob': { processes: ['Receive', 'Stow', 'Pack', 'Prep'], pitProcesses: [], onsite: false },
  'nzahabas': { processes: ['Stow', 'Pack', 'VRET Pack', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'kdanpapa': { processes: ['Receive', 'Stow', 'IB PS', 'Pick', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: true },
  'dansmilz': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'poonvlon': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'arinangu': { processes: ['Pack', 'Ship', 'VRET Pack', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'mounikep': { processes: ['Pick', 'Ship', 'VRET Pack', 'Auto Slam'], pitProcesses: [], onsite: false },
  'symusawi': { processes: ['Stow', 'Pack', 'VRET Pack'], pitProcesses: [], onsite: false },
  'bsafdari': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'pachangh': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'OB PS', 'VRC', 'Auto Slam'], pitProcesses: [], onsite: false },
  'thogmick': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'mmozafad': { processes: ['SBC', 'CC', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'wsantoas': { processes: ['Pick', 'Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'haimumoh': { processes: ['Pack', 'Ship', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'brealexx': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'laurmaye': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'ahmadgam': { processes: ['Ship'], pitProcesses: [], onsite: false },
  'nazfarid': { processes: ['Pick', 'Sort'], pitProcesses: [], onsite: false },
  'mominguy': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'wrazimuh': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: true },
  'alitamat': { processes: ['Receive', 'Stow', 'Pick'], pitProcesses: [], onsite: false },
  'petheka': { processes: ['Receive', 'Stow', 'IB PS', 'Pick', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: true },
  'hoenaome': { processes: ['SBC', 'SRC', 'IB PS', 'VRC'], pitProcesses: [], onsite: false },
  'omatther': { processes: ['RSR', 'Dock', 'Stow'], pitProcesses: [], onsite: false },
  'adriwany': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: true },
  'nasibamo': { processes: ['Pick', 'Pack', 'Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: true },
  'nazarshw': { processes: ['Pick', 'Pack', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'haitayib': { processes: ['Receive', 'Stow', 'Prep'], pitProcesses: [], onsite: false },
  'baljbaln': { processes: ['Dock', 'Receive', 'Stow', 'Ship', 'Prep'], pitProcesses: [], onsite: false },
  'nobroxas': { processes: ['Pick', 'Sort'], pitProcesses: [], onsite: false },
  'sjammaki': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'tdhaniel': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: true },
  'azaminal': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'sabiraal': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'gkirkau': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'kauqkara': { processes: ['Pick', 'Pack', 'Sort', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'rboavida': { processes: ['Pick', 'Pack', 'Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'ruqrezat': { processes: ['Receive', 'Stow', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'hardiajo': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'nalawshi': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: true },
  'obrieqna': { processes: ['SBC', 'CC', 'Stow'], pitProcesses: [], onsite: false },
  'rahinaz': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'kiarammx': { processes: ['KPP'], pitProcesses: [], onsite: false },
  'karanbz': { processes: ['Pack'], pitProcesses: [], onsite: false },
  'nagaradt': { processes: ['Pack', 'Sort', 'Ship', 'OB PS', 'VRET Pack', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'randollw': { processes: ['Dock', 'Receive', 'IB PS', 'Prep'], pitProcesses: [], onsite: false },
  'alizmadu': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'vasilati': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'faridaha': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'kariziag': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'omanbnaw': { processes: ['Receive', 'Stow', 'Ship', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'omekalsu': { processes: ['Receive', 'Pack'], pitProcesses: [], onsite: false },
  'sarjangm': { processes: ['Dock', 'Receive', 'Stow', 'IB PS'], pitProcesses: [], onsite: false },
  'khabenaf': { processes: ['Receive', 'Stow', 'Ship', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'mosethio': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'rabbasil': { processes: ['Pick', 'Pack', 'VRET Pack', 'Manual Slam'], pitProcesses: [], onsite: false },
  'tsmitjor': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'somaial': { processes: ['Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'bsyurong': { processes: ['Pick', 'VRC'], pitProcesses: [], onsite: false },
  'dhazrupi': { processes: ['Pack', 'Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'jaspkka': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'samadzhs': { processes: ['Pack', 'Ship', 'Waterspider'], pitProcesses: [], onsite: false },
  'thetupuf': { processes: ['Receive', 'Stow', 'Pick', 'VRC', 'Prep'], pitProcesses: [], onsite: true },
  'keocharl': { processes: ['Pick', 'Pack', 'OB PS', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'hanntiai': { processes: ['Stow', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'shojaebi': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: true },
  'mlogagra': { processes: ['Receive', 'Stow', 'Pick', 'Pack', 'Sort', 'Ship', 'VRET Pack', 'VRC', 'Manual Slam', 'Prep'], pitProcesses: [], onsite: false },
  'casimibi': { processes: ['Receive', 'Stow', 'Ship'], pitProcesses: [], onsite: false },
  'bezuroma': { processes: ['Receive', 'Pick', 'Pack'], pitProcesses: [], onsite: false },
  'azamkhod': { processes: ['Pick', 'Pack', 'Sort', 'VRC', 'Waterspider'], pitProcesses: [], onsite: false },
  'nunekcat': { processes: ['Receive', 'Stow', 'Pack', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'gagandkv': { processes: ['SBC', 'CC', 'Receive'], pitProcesses: [], onsite: false },
  'jaspssan': { processes: ['Stow', 'Pack'], pitProcesses: [], onsite: false },
  'sukanydr': { processes: ['Pick', 'Sort', 'Ship'], pitProcesses: [], onsite: true },
  'fbryccol': { processes: ['Stow', 'Pick', 'Pack'], pitProcesses: [], onsite: false },
  'hmohafat': { processes: ['Pick', 'Pack', 'VRET Pack', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'almarip': { processes: ['RSR', 'Dock', 'Stow', 'Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'mursalgh': { processes: ['Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'doamandc': { processes: ['Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'shivaulo': { processes: ['Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'rzahraqu': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'jataybao': { processes: ['Receive', 'Stow', 'Pick'], pitProcesses: [], onsite: false },
  'wimals': { processes: ['RSR', 'Dock', 'Receive', 'Stow'], pitProcesses: [], onsite: false },
  'mmadanag': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'farhuhus': { processes: ['Receive', 'Stow', 'Pick', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'fkagurp': { processes: ['Stow', 'Pick', 'Pack', 'VRET Pack', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'tshainah': { processes: ['SBC', 'CC', 'Stow', 'Pick', 'Pack', 'Sort', 'Ship', 'VRET Pack', 'VRC', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'ballstee': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'royhussl': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: true },
  'hortemat': { processes: ['Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'dejnjarr': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'italnico': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'zubrezay': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: true },
  'dhadupri': { processes: ['Pick', 'Pack', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'paxtothu': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'zuliaism': { processes: ['Pack', 'Sort', 'VRET Pack', 'VRC'], pitProcesses: [], onsite: false },
  'naduw': { processes: ['Pick', 'Pack', 'Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'cbkumana': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: true },
  'penarroj': { processes: ['SBC', 'CC', 'Dock', 'Receive', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'patelura': { processes: [], pitProcesses: [], onsite: false },
  'simagulr': { processes: ['Stow', 'VRC'], pitProcesses: [], onsite: false },
  'hugnoori': { processes: ['Pick', 'Pack', 'VRC', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'ulauatig': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'rezmilav': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'uzahrajo': { processes: ['Pack', 'Sort', 'VRET Pack', 'VRC', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'pmealani': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'phoecmca': { processes: ['Receive', 'IB PS', 'Pick', 'Prep'], pitProcesses: [], onsite: false },
  'kumbunis': { processes: ['Pick', 'Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: true },
  'nawrozis': { processes: ['Pick', 'Pack', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'bucktlac': { processes: ['Pack', 'Ship', 'VRC', 'Manual Slam', 'Auto Slam', 'Waterspider'], pitProcesses: [], onsite: false },
  'ylaisoli': { processes: ['SBC', 'CC', 'SRC', 'Stow', 'VRC'], pitProcesses: [], onsite: false },
  'dedhruvi': { processes: ['Stow', 'IB PS', 'Pick'], pitProcesses: [], onsite: false },
  'ellawine': { processes: ['Pack', 'Ship'], pitProcesses: [], onsite: false },
  'eeuchhen': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'VRC', 'KPP', 'Auto Slam'], pitProcesses: [], onsite: false },
  'gingcoj': { processes: ['Pick', 'Pack', 'Ship'], pitProcesses: [], onsite: false },
  'wamansor': { processes: ['Receive', 'Stow', 'Pack', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'lmaramgr': { processes: ['Dock', 'Receive', 'Stow', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'cazsimio': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'qstemars': { processes: ['Stow', 'VRC'], pitProcesses: [], onsite: false },
  'enjnagar': { processes: ['Pick'], pitProcesses: [], onsite: false },
  'meichenc': { processes: ['Stow', 'Pick', 'Pack', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'vrshukla': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: false },
  'mandikoi': { processes: ['SBC', 'CC', 'Receive', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'golitezz': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'browjoa': { processes: ['RSR', 'Stow', 'Pick', 'Pack', 'Sort', 'VRET Pack', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'windwula': { processes: ['Dock', 'Receive', 'Stow', 'VRC', 'Prep', 'Cubiscan'], pitProcesses: [], onsite: false },
  'ahmsomay': { processes: ['Pick', 'Pack', 'VRET Pack', 'KPP'], pitProcesses: [], onsite: false },
  'harpesna': { processes: ['Pack'], pitProcesses: [], onsite: false },
  'kunnaung': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'namuvais': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: false },
  'rezagulv': { processes: ['Pick', 'Pack'], pitProcesses: [], onsite: true },
  'mirzaeim': { processes: ['Pack', 'Sort', 'VRC', 'Gift Wrap', 'Waterspider'], pitProcesses: [], onsite: false },
  'gibkylie': { processes: ['Pick', 'Pack', 'VRET Pack', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'tubaoreh': { processes: ['SBC', 'CC', 'Pack', 'Sort', 'VRC', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'bhypatel': { processes: ['Dock', 'Receive', 'Stow', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'ntnirosh': { processes: ['Receive', 'Stow'], pitProcesses: [], onsite: false },
  'pushapds': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'wlafapio': { processes: ['Pick'], pitProcesses: [], onsite: true },
  'javmuzin': { processes: ['Receive', 'Stow', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'wperafiq': { processes: ['Pick', 'Pack', 'VRC'], pitProcesses: [], onsite: false },
  'mrajejan': { processes: ['Receive', 'Stow', 'Pack', 'Manual Slam', 'Prep'], pitProcesses: [], onsite: false },
  'yaffiena': { processes: ['Receive', 'Stow', 'IB PS', 'Pack'], pitProcesses: [], onsite: false },
  'muddasda': { processes: ['Stow', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'hokdevin': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'Cubiscan'], pitProcesses: [], onsite: false },
  'andebrar': { processes: ['Stow', 'IB PS', 'Cubiscan'], pitProcesses: [], onsite: true },
  'robihaid': { processes: ['Pack', 'VRET Pack'], pitProcesses: [], onsite: false },
  'geileene': { processes: ['Pick', 'Pack', 'Sort', 'VRET Pack', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'zivadm': { processes: ['Pick', 'Ship', 'OB PS', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'nnikbakh': { processes: ['Receive', 'Ship', 'Prep'], pitProcesses: [], onsite: false },
  'fcrmaang': { processes: ['Pack', 'Sort', 'Ship', 'OB PS', 'VRET Pack', 'VRC', 'KPP', 'Manual Slam', 'Gift Wrap'], pitProcesses: [], onsite: false },
  'edwarfif': { processes: ['SBC', 'CC', 'SRC', 'Dock', 'Receive', 'Stow', 'IB PS', 'Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'VRC', 'KPP', 'Manual Slam', 'Gift Wrap', 'Prep'], pitProcesses: [], onsite: false },
  'vishanex': { processes: ['Pack', 'Sort', 'Waterspider'], pitProcesses: [], onsite: false },
  'weechriv': { processes: ['Stow', 'IB PS', 'Pick', 'VRC', 'Prep'], pitProcesses: [], onsite: false },
  'nuokaaao': { processes: ['Pick', 'Pack', 'VRET Pack', 'KPP', 'Gift Wrap'], pitProcesses: [], onsite: true },
  'adkemboi': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: true },
  'kaurhran': { processes: ['Dock', 'Receive', 'Stow', 'IB PS', 'Prep'], pitProcesses: [], onsite: false },
  'rahisuml': { processes: ['Pick', 'Ship', 'VRC'], pitProcesses: [], onsite: true },
  'buianth': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'okojdenn': { processes: ['Stow'], pitProcesses: [], onsite: false },
  'fakarimh': { processes: ['Pick', 'Sort', 'VRC'], pitProcesses: [], onsite: false },
  'mohsitim': { processes: ['Stow', 'Pick', 'Sort'], pitProcesses: [], onsite: false },
  'razaiemu': { processes: ['Stow', 'Pick'], pitProcesses: [], onsite: true },
  'smjordai': { processes: ['SBC', 'CC', 'Pick', 'VRC'], pitProcesses: [], onsite: false },
  'mormattz': { processes: ['Pick', 'Sort', 'Ship', 'VRC'], pitProcesses: [], onsite: false },
  'marybuol': { processes: ['Pick', 'Ship'], pitProcesses: [], onsite: false },
  'y': { processes: [], pitProcesses: [], onsite: false },
  's': { processes: [], pitProcesses: [], onsite: false },
  '���w��ai���ez�f��>���q��a��|i�d��?q�;��y~)�̑�#m': { processes: [], pitProcesses: [], onsite: false },
  '^�ow� ��3���h��./6��knod�@�8r`�ã�t[4e>�k���asc+���ey�����5��i��qw��~��om�4]���~��ɉ���-��i�^yy��\����yd>qw$�k�s�3�b2�k���t>:�3[/%s�*�}���+4�?�rv��  �� pk     ! ���u
5  +�    xl/worksheets/sheet1.xml��[o�0��'�;x~�  b�eh�&�jwy6�	����6v����	��
�ji����;_�w{y�g�f�2�a'�j�rq�����pb,+sv�z c�&?�wjol`	j����j���� ��
j�djkf�w�}si`��� �%%m#}ce��p|+��dc�,�orq�#m�[p��ͷ�v��ࠔh>�_�j�u�y���d����ݸ�orp���l�~�e�c�3~]�&���e�����}!��+z�u�	�o��\z�ib_�ѳ���7�s��x,��,
�8�f��l��:�w�ίh�:g_�p@�����v�o,[=a�z	)�7�j�m=��dv���p�ڧ��v1>��/��9eb�42n�3<�$�+e���b�[w,�ez�����֡���fj���t�zk���&�&�e|bͽ\-���s%��ǫ,��{�$��m��v��� ˃鹝;j0���똸*�_e}'�q`����9�po����lzy#@�`�k��uv�	�=
����
�mxk]���:ض�c�^�ǜ�o��b�  ��   �����r�f�dev>�d$�e�̚����7�բ�y�궒����g@|9#2���۱�:��x	���?��㯷���헟���������ß���?������������o��o��?����������>�0�ww������y������gh7;����?��g��ł���3�����������o�����ۏixu�m�_u��»
*u8�ы0�0�0�0g�ϻ�̿q����y&���v��7��lo�{ӫ5=�mo���7�jm{��d��?�����~6]���tt�����t�?�g�t�s��&+s�/3�qc:�fw�aԥg�g�ywхv�d�c��n�t��<��o��^uxs�w����� ��ލ�q�����1��(��y�:9�\r���;�\q����3�=�5�q.��y�r���]�ѭ����~���.i<�
�<��+=������i��q/���ϖn[��u�p�x��c��!c�1jѩzȼ��ȶ�ߥ�mc��ni�az��y��^�+��לg': { processes: [], pitProcesses: [], onsite: false },
  ''zf&�u(d7���>��': { processes: [], pitProcesses: [], onsite: false },
  '�': { processes: [], pitProcesses: [], onsite: false },
  '�*v�.�%�z�ֽ'֤ӊ1u��3i�_�gv��ɓu$�(g('(}r': { processes: [], pitProcesses: [], onsite: false },
  'wà�f(�ysj�}����t��<��u^�ic��v��#p y��ο0k/x�pnp����s�(3a�7��'h�������9�0ƅa�x��9�.��li��[>����	je�2b��̛r�f�ϧ��': { processes: [], pitProcesses: [], onsite: false },
  '��i�@g���x1�w�a�k8�fk�j���k�snl����]c�i�+[�hr�hr�hr����ƅ�b��~?w[�;�sq����(y>��[]b�fǝ jѧ�d)�����r+e�*e�*e��t̲': { processes: [], pitProcesses: [], onsite: false },
  'u7�<�ly:��yݹ��֔b���軞�ܖ�c�a��ķ!�[ue�*e�*e�*e��t���u7d.�}ϻu�d�-y�din�(�[�֓��z�%	dw$��hr�hr�hr�hr��i���� �{�{�����ҧqw
pȟow�~_]�0a���va��a�+�t)�t)�t)�\�b�md��1�g{)vx���c�2![	]i������d�)x�p�m��(e��hu�hu�hu�hw�����6dt��h{�bƻ8�0zc�m}�����=z�a���5-��ɪ+�u)�u)�u)�]�r�]#pz��,���xd\��3�+��'�d�'\h�����:�կr��x�hi�4_����5�ůqb': { processes: [], pitProcesses: [], onsite: false },
  '3�9!gxg��{�l�<��'үzbq�z�zp�}\=': { processes: [], pitProcesses: [], onsite: false },
  '��+xp�h宼��:�qhndk)�uw�)y�xs��aw�<h�˚�w�vօۧq�u�a�����3y��&o�� ������5p)m��t�ѻf��5h�<�7o�b��c� �@h�*��k��	�dw��h� h$q�&���
(��!r�����u�;�$7&&i>�^*�?�@��υ
�gov=���ȶzx���eתaw+e��}�������i���6��.�y��7&�o\�/ms�r#���v�l^w�m^)�%/�q^ë�y��(�:�κ05wd� &y.j�*i\��i\w��hr�hѥ�e�t\�qѝ3xmg]��x�ߴ�r@�t�g�d*gy�ho,�j�bi&p��a�p��*�6j_�d�kj�_ۖ���@����o��	��;�)������aqk�z��'�]�r\�p�₨��r_�͍�k-~� @2�$ø��kl\���3��sn~2�t��bn&wdk&)��dr���u\��ԝ�h|#�s���;2�� �g�w�~����qi��vqi�q�+��h': { processes: [], pitProcesses: [], onsite: false },
  'rt)��&�ldrw��<���;��=��]t��j���]��3��t w`�bi&��q�+�$��q�+�2gp_}�s߈������zn�΅^cb[�bx�m����g���o�sz�\��_qz�a#��j����}#�z���6/�uw8w'�7w��_a��ي��<���~�a�a_��	�e��e��6�e��c�����x4��ů�fx`�qqr2&f{�6;���s�s�������': { processes: [], pitProcesses: [], onsite: false },
  'ri�)��i�w3��'�h�i�_��ld]����4��䤈i��ב����tp�ѥ�vq�+�t)�t)zr��r��i��u*������p!}��kg]���o�t&<�_��l9��ur,�uo��(�%>�w��ɓ e��ࣇf|���q�a2�6[��m�����rs��{�n�t�ܷ�	���-a\-a�h��r$���}������\�����
vd>7'&s9i�;�ƅg��i	� �
lx)v`ue��tl��=*��ǣ'��s�q�k7w�k0k�%x!���aw#.�p�9��]x�q���$-�a^c�i�������7����2,m\`�ѿ8�k��ܗ�j�/i� e_�+�%�q�a�(s:���h���w�f_:'#�l��ے&��r�hk� h1�+�#jr�r����kh���*�������� �u�#5&�%?��]�m嶬z�o��h�	r4.��	r���>���;��f���e>`4�.�f��m�ƅ���a's1���﯐�����@i�4q�/r�o����(a����q����:�$���a��
�h��r$��h��r$y2z���h�k�����q����:g�.�ӂ�&s9j�5��wq�+�t)�r��r��r�hj��u*6e#2z4�h_���f���/t�xu.��tbo����f�n9�*	�d���r�r$k^)�uw$k<)����w_�>6��/m���z�$뒻pt)����o��p!et�<)�sw4�y*��8': { processes: [], pitProcesses: [], onsite: false },
  'r': { processes: [], pitProcesses: [], onsite: false },
  '��ɬ��t���z�|cz�=���i�q�		l�rt�l�p�ɔ�~�h��̚��rgc�$�ac���z��|6���n���ѡ`c��c��^æ�f6��%w<���*���l��y��t>¤��7uhk���:��sv�p��<l�4_��r�5��ſ�@;8��	v&̹�wzg��p�'+.��n�c���k���).�l�ׂ��z _ڤ�k�?�{�>�e_z�r-��sq1��t�pgco��kn��x�:�ka�o��j�j��j�j��*e�*e�*ek�r���rg�s�/�τ_�9[ڜ1��>{�1.����r����p	r�h�)btw�x\����fã�3��՘���lxpu&<�&s9�+�r�n���ț��^)�'��w?w\9��rmnr�o�� ΄gg�#�1a�v��d�l��k�q,��q�y�$��h��': { processes: [], pitProcesses: [], onsite: false },
  'r$����5�ſok}i�����d�l��]%��l�k��n�����g�-ϥqp�]v]�#����.r�.�ț:����7�jw�&s����)�ɿ��.a���	r�j�	�6�b#h�u8���y��!�4x0�b'�c<{ʝx�ě�t(r%t��:a�t	� ��c'����?�������o��   ��   ��l��': { processes: [], pitProcesses: [], onsite: false },
  '�0�_��^�f����'<��f�v����x��m���ꮯ6z��j�b����=l<�n
����>=s���~�+��;��sluu��l�:�b�ܵ� n�o���oۼ����`d�1`l����o�6>���_ .m|�~q��o�_ҝ6���s�*ʌwn8�l�y�i��9�i����': { processes: [], pitProcesses: [], onsite: false },
  'f]1�h��;�f������j&8��d*�r��ϕ7��x*sz)		>��������δ 9a����1!�� ���[)�ժw�%��@�h��c(��,��cg�)����h��u�����	v'��5�ǔ������h�x��j�m��>c��q�+twt	�}�e�ietan&���oɔpv�����c�a��ި𱔂��
ox� 6�b���q���di�-�a������ě���7~}ɢi৩����,��muhc��4�d>�����{f�,n�ڵk�o����u7���pц���|[z7�#�a��8?e`��-���   ��   ���)�hm-qi,iէ   ��   ���)hlo�m,j��+v�im+�u2�3wr(�lπ�k����j
i�%%��0^fjbjj�g�����_������eg����   �� pk     ! ��n  �      xl/theme/theme1.xml�y͋7��?sw�5�%���l��$d�����qv32��%9�r(���bo=��@��	$���'��#��$�ljzv�g������~z�t�ҽ�zg��_�p�=��ؘ$ӗk8(4|oh��e	n�,�k۟~rm����dl��i9�*�����f8��&��h�#���ޘ+�r�#��^�bp{}2!#��j{��o�1�b�(�w��%���òb���r�!��a�1;�{��(~h�%���/�v&d�ycn��2�l`|x�s���j� �z{�_�\����z��ҧh4�����:�n�ap�ա�w�u���_]�����נt����e�a)>\ç�f�g�נ_[��k�^p��kpdir��.��jw��d����a��)�q���rslx7�z��2> �r$i���o����(9���%�o�&`�t)ju��>���#��02��]`�xr�xb��l��+��7 /�={����=����_���*kn%ss�տ_����_�����7��'��ŀ��˗���:����/�}����}��o�����!����c�&�a���?��0bē@�v����^[ ��u����x��<�kٺ�$���f��c�vw:ચ���p�lݓ󹉻�бk�.j� ��3�w�rٍ�e����8��s��c���c���=2�l��������%cr`%r.�cb���e �����m�èk�=|d#a[ �0~�����h.q�r9d15��d�2r�g&�/$dz�)��c': { processes: [], pitProcesses: [], onsite: false },
  '��]�6�kr�ҹ�3�=v؍p<s�l���~&!e�w�i|��;d=cp�1ܷ	���f��j��'��e������t���e�<�ص͉3;:�ڻst��{�>sx�a3���w`��j�+��u��`e��k�)r�+e��m�goq�x(�ߤ�d�j]8�tz��m�5���)��0���i�yg�z�|]p+~o��`_�=��|j ����qk�<a�': { processes: [], pitProcesses: [], onsite: false },
  '݂��\d��zl؛6fv����ω�'�w�ws�[���:�(e�d��	�': { processes: [], pitProcesses: [], onsite: false },
  '�r�[j%e~�y��j;����� +c`�)}d� �j���  �� pk     ! ��1y  l     xl/styles.xml�xm��6�^��!�w6/$y@���tҵ��[�_m�u���w��w�$$�]��': { processes: [], pitProcesses: [], onsite: false },
  '�b�=�̌_���ӿ`�+�%<b': { processes: [], pitProcesses: [], onsite: false },
  'r�3=�cfw��a9.(;tݞ�0ٮ�b�;m��b�og�wj�g��5v��<�yi�=�׈�����t~���ʉ���sǝ���t¡g6�����	4���尅ts��u�̸wf�%>�^p��r0�i��': { processes: [], pitProcesses: [], onsite: false },
  '\g�w��x4��`�����2h�����c�nuj�����a�7�j2��$a�_���l�m|�7   �� pk     ! �ᣮ�  �4     xl/sharedstrings.xml|[�r9�}߈���v<��ؘ�p{��h��el���~c��*�.�pr���ɢ{/8���v(y ����>�������κ������/7ʴ[�۶���e���_nt��6׵k�o7g������˧��d������c�-m��?��i��9��?��cw�f�]il�������h�ި�m�y����ި�ڷ`?��כϟ:��s�y�����������v1�?��o1�^��u�]���v���zg�z����]�/��1����n[�6���-}ԝu�z�j�s����u@l���>�i��t���(pn4��ګgms�i*m/�&�iv��t]c8�\���۪���{����1@��vfk�ѩ{�����w���uo�1���gk���g|�a�j}6y�	��k���j6����������ǿ��vb�ϻ���%������m�m�����@s͵�z�t�iuexu�/��l�-h!w��>�$l���ѿ����a�}v��t����b��e���m���v���d��9ʁ�[ݕz��\��{<��{�.cu�ύ�kҿ��xk`g�qs��2�?l\f�+0�o��-vm���ұ�^����n`�f�m�*!��&r����6�̡u���6[���miղb��r;�(���n��ʶ,m��ڄc������c����e�w[�t�=�ж���vwz|���ڨ;�o�l�ma�ᢼ��){�u{jl\��m�(�^ɵ>�n�r�o�w��o��g�u�uo�{�j[ꐗp3���ahgz�o[�a�:���ȗ�{s���;�m���q㯿u=�'��!}��`': { processes: [], pitProcesses: [], onsite: false },
  'c�v��jl�7(������^m�q�=����˟���5;õ��t�w�tۑ�9	���b�\o�1�pi��ph��o�jn�`j���w$�vb�sx��~x��22�r��ԥ�pdc�rwhu�4c@�k�~���': { processes: [], pitProcesses: [], onsite: false },
  '5��jx}�-������n�p�l����bv���a�u%�_�6�ŭ��⪍��uq� k�d��)��$�ɨ��&d�$�k�� 9����w�3��:��y��wi:a��wp;�v�:_`�(4ev���f��g�~w%�qvv���dq?^=m6j:zy)�����ň��ʝ��k����x1+w^�g�k��� ｣��r��=�������'�@h=����n�ۧ�+[���6����n}e���(trv֞����1{�p�$rn�� %��t��q�c��!3u��6��6����=}a_���.y/�����[+��d�a��{��e�:���i�~t��f<��rmý��@���x�'a��p��jjs�e*�2����t��=-�x�xik��vz��p!w(؇-���!nu�������єg.%���@����)�9{ (�%�l\	=0h�g��k;y��d�7/���b��/���r�yӡ}����%�w�
�nt�m�x�r�vk}�s@ik���xlhy6��-���n��/��֥�v������7�bf=ߢ�c}f��%���j��x3y@@0�,����]�b����l��c�	��t9��?x~cp/#f��p	� ��p���r>����pͺ x���0z�n<����q��j�s�qu֢����*�pb�i��&��r� ha m�tur�q2]�e�yh0�\���p�g���ul�g�=�q�fu6���v����|2#{�c�e��	�
rn�}vj&y�b2u��>�&��8s����3&lk���d�۫�p�դu ?g��#׎�h�e�l�
�')h�`���q�p�ξ�c��7�u��m�`�+�^%�4e��������qt���kbe��g3�ܹx�k(���x�v/�/]�$�njt��
�=�/¢�b8���p:fsw��9�� � �^ea ��\�$�v�rɲu+�\�[�ha���,i+:��o��(��z�st��9�&x����2v� ~�t���mpl�`d	�ޝ�%ie�j�s��x��ep���=��=;�	΀t!(��ǳ�xn�a1}v�s���p��-g�3�'g`��3�c	�wv6y<�����g�a=zgf�0�6��n ': { processes: [], pitProcesses: [], onsite: false },
  '�m�_������琢i�i�=zji��vg�': { processes: [], pitProcesses: [], onsite: false },
  'ms': { processes: [], pitProcesses: [], onsite: false },
  'n�)c~�g�;� ��}p$�)� �؎$�.r&mܘwؼn��� ��|3;�ӕ�ޓ `�f��qjg��}a	���v��/�c?��u�v�����ϊ͝<߰y�ps$�x�b����nشyd*�f��j� ���u���i���1���t?�|��e����[5������`'���5�p7�ǒ�k�-˹��|�ȸ$�ev�(�<a<{>�5)`yl`()��,�+�m:�\x�]]%^8��a+ti��p�-��h�!��y��ib��k�,��`����{�� {�m>���[�-p��h�����k��d��!�@�ŏ<u�*�%��z?^,&k�<}�īs��#\��rh�u�>��v��9�l�;��#�n�)�|�:��|��]wj s8�.����+¨�ٺ��!�볒!zt!���b%o���ѫ)': { processes: [], pitProcesses: [], onsite: false },
  '��c�f�r)�/���o�`7�d�m�e�f�c�`�hc����u�������@h�uo�.b�p#�b3��3��[r�}-p�4��v�/#2�zamj�te]\�ɠ��մ�eٓ��ps�d#��[�ry����%��� )xiʰ%�����և6?n�;<����~\m���je�q��{�p>�cݎf���2]�e��!�j�!sjƃ'�ćb����{y�-�(#��dd$�������w?': { processes: [], pitProcesses: [], onsite: false },
  '��_qݘ����ٞ4g���<8_�`�': { processes: [], pitProcesses: [], onsite: false },
  '���&2�r�*a�h�\���1��f!i&�@get�a��1`�>m�': { processes: [], pitProcesses: [], onsite: false },
  '��8���u`*��@��u�n�w:��9���}�eo��:��6�ϟ���s[5': { processes: [], pitProcesses: [], onsite: false },
  '�/'��vkq3��stt6�v�t': { processes: [], pitProcesses: [], onsite: false },
};

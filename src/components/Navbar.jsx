import { Home, BarChartHorizontal } from 'lucide-react'; // In a real file

const Navbar = ({ currentPage, setCurrentPage }) => {
  const navItems = [{ id: 'home', label: 'Home', icon: Home }, { id: 'stats', label: 'Stats', icon: BarChartHorizontal }];
  return <nav className="sticky bottom-0 left-0 right-0 bg-[#1E1E1E] bg-opacity-80 backdrop-blur-lg border-t border-t-gray-700"><div className="max-w-2xl mx-auto flex justify-around items-center p-2">{navItems.map(item => (<button key={item.id} onClick={() => setCurrentPage(item.id)} className={`flex flex-col items-center justify-center w-24 p-2 rounded-lg transition-colors ${currentPage === item.id ? 'text-[#34D399]' : 'text-gray-400 hover:text-white'}`}><item.icon className="w-6 h-6 mb-1" /><span className="text-xs font-medium">{item.label}</span></button>))}</div></nav>;
};

export default Navbar; // In a real file

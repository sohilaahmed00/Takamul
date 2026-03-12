import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
Search, Plus, Edit, Trash2,
ChevronDown, ArrowRight, ArrowLeft,
Users, Database, Copy
} from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import { useGroups } from '@/context/GroupsContext';
import { cn } from '@/lib/utils';
import MobileDataCard from '@/components/MobileDataCard';
import AddGroupModal from '@/components/AddGroupModal';
import Toast from '@/components/Toast';

export default function UserGroups() {

const { direction } = useLanguage();
const { groups, deleteGroup, duplicateGroup } = useGroups();
const navigate = useNavigate();

const [searchTerm, setSearchTerm] = useState('');
const [itemsPerPage, setItemsPerPage] = useState(10);
const [selectedItems, setSelectedItems] = useState<string[]>([]);

const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
const [menuPosition, setMenuPosition] = useState<{top:number,left:number}|null>(null);

const [showAddModal,setShowAddModal]=useState(false);

const [toastMessage,setToastMessage]=useState('');
const [toastType,setToastType]=useState<'success'|'error'>('success');
const [showToast,setShowToast]=useState(false);

useEffect(()=>{
const handleClickOutside=(e:MouseEvent)=>{
if(!(e.target as HTMLElement).closest('.action-menu-container')){
setActiveActionMenu(null);
}
};
window.addEventListener('click',handleClickOutside);
return()=>window.removeEventListener('click',handleClickOutside);
},[]);

const filteredGroups = groups.filter(g =>
g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
g.code.toString().includes(searchTerm)
);

const handleSelectAll=(e:React.ChangeEvent<HTMLInputElement>)=>{
if(e.target.checked){
setSelectedItems(filteredGroups.map(g=>String(g.id)));
}else{
setSelectedItems([]);
}
};

const handleSelectItem=(id:string)=>{
setSelectedItems(prev=>
prev.includes(id)
? prev.filter(i=>i!==id)
: [...prev,id]
);
};

const handleDelete=async(id:number)=>{
try{
await deleteGroup(id);

setToastMessage('تم حذف المجموعة');
setToastType('success');
setShowToast(true);

}catch(e){

setToastMessage('فشل حذف المجموعة');
setToastType('error');
setShowToast(true);

}

setActiveActionMenu(null);
};

const handleDuplicate=async(id:number)=>{
try{

await duplicateGroup(id);

setToastMessage('تم تكرار المجموعة');
setToastType('success');
setShowToast(true);

}catch(e){

setToastMessage('فشل التكرار');
setToastType('error');
setShowToast(true);

}

setActiveActionMenu(null);
};

return(

<div className="space-y-4" dir={direction}>

{/* header */}

<div className="takamol-page-header">

<div className={direction==='rtl'?'text-right':'text-left'}>

<h1 className="takamol-page-title flex items-center gap-2">
<Users size={24}/>
مجموعات المستخدمين
</h1>

</div>

<button
onClick={()=>setShowAddModal(true)}
className="flex items-center gap-2 bg-[#00a651] hover:bg-[#008f45] text-white px-6 py-2.5 rounded-md font-bold"
>
<Plus size={20}/>
اضافة مجموعة
</button>

</div>


{/* search */}

<div className="relative w-72">

<input
type="text"
placeholder="بحث..."
value={searchTerm}
onChange={(e)=>setSearchTerm(e.target.value)}
className="takamol-input !py-2"
/>

<Search
className={cn(
"absolute top-1/2 -translate-y-1/2 text-gray-400",
direction==='rtl'?"left-3":"right-3"
)}
size={18}
/>

</div>


{/* table */}

<div className="border border-gray-200 rounded-xl overflow-hidden">

<table className="w-full text-center">

<thead className="bg-[#00a651] text-white">

<tr>

<th className="p-3">

<input
type="checkbox"
checked={
selectedItems.length===filteredGroups.length &&
filteredGroups.length>0
}
onChange={handleSelectAll}
/>

</th>

<th>الكود</th>
<th>اسم المجموعة</th>
<th>الإجراءات</th>

</tr>

</thead>

<tbody>

{filteredGroups.map(group=>(

<tr key={group.id} className="border-b">

<td>

<input
type="checkbox"
checked={selectedItems.includes(String(group.id))}
onChange={()=>handleSelectItem(String(group.id))}
/>

</td>

<td>{group.code}</td>

<td className="font-bold text-primary">

{group.name}

</td>

<td className="relative action-menu-container">

<button

onClick={(e)=>{

e.stopPropagation();

const rect=e.currentTarget.getBoundingClientRect();

setMenuPosition({

top:rect.bottom+window.scrollY,

left:rect.left+window.scrollX+(rect.width/2)

});

setActiveActionMenu(

activeActionMenu===group.id
? null
: group.id
);

}}

className="bg-green-500 text-white px-3 py-1 rounded-md flex gap-1 items-center mx-auto"
>

خيارات
<ChevronDown size={14}/>

</button>


{/* dropdown */}

{activeActionMenu===group.id && menuPosition &&

createPortal(

<div

style={{

position:'absolute',

top:menuPosition.top,

left:menuPosition.left,

transform:'translateX(-50%)'

}}

className="w-48 bg-white border rounded-xl shadow-xl z-[9999] py-2"

>

<button

onClick={()=>handleDuplicate(group.id)}

className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"

>

<Copy size={16}/>
تكرار

</button>

<button

onClick={()=>navigate(`/users/groups/edit/${group.id}`)}

className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"

>

<Edit size={16}/>
تعديل

</button>

<button

onClick={()=>handleDelete(group.id)}

className="w-full px-4 py-2 text-sm flex items-center gap-2 text-red-600 hover:bg-red-50"

>

<Trash2 size={16}/>
حذف

</button>

</div>,

document.body

)}

</td>

</tr>

))}

</tbody>

</table>

</div>


{/* modals */}

<AddGroupModal
isOpen={showAddModal}
onClose={()=>setShowAddModal(false)}
/>


<Toast
isOpen={showToast}
message={toastMessage}
type={toastType}
onClose={()=>setShowToast(false)}
/>

</div>

);

}
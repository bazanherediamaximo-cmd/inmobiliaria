document.addEventListener('DOMContentLoaded', () => {

    
    const propiedadesData = {
        1: {
            titulo: "Casa Lujosa en Country Jockey",
            precio: "USD 450.000",
            img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
            dorm: 4, banos: 3, area: 320, tipo: "Venta",
            desc: "Espectacular propiedad de diseño moderno en Country Jockey Club. Cuenta con piscina climatizada, quincho cerrado, cochera doble y seguridad 24hs. Pisos de porcelanato de primera."
        },
        2: {
            titulo: "Casa Minimalista Villa Allende",
            precio: "USD 1.200 /mes",
            img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070",
            dorm: 3, banos: 2, area: 210, tipo: "Alquiler",
            desc: "Hermosa casa en zona residencial de Villa Allende. Jardín amplio, cocina integrada con isla, sistema de calefacción central. A pocos minutos del shopping y colegios."
        },
        3: {
            titulo: "Mansión en Valle Escondido",
            precio: "USD 890.000",
            img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053",
            dorm: 5, banos: 5, area: 550, tipo: "Oportunidad",
            desc: "Oportunidad única en barrio cerrado de categoría. Cine privado, gimnasio, cava de vinos y parque de 1500m2. Terminaciones de mármol y madera de primera calidad."
        }
    };

   
    const modal = document.getElementById('propertyModal');
    const closeBtn = document.querySelector('.close-modal');
    const cards = document.querySelectorAll('.open-modal-btn');
    const modalImg = document.getElementById('modalImg');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const data = propiedadesData[id];

            if(data) {
              
                document.getElementById('modalTitle').textContent = data.titulo;
                document.getElementById('modalPrice').textContent = data.precio;
                document.getElementById('modalBadge').textContent = data.tipo;
                document.getElementById('modalBeds').textContent = data.dorm;
                document.getElementById('modalBaths').textContent = data.banos;
                document.getElementById('modalArea').textContent = data.area;
                document.getElementById('modalDesc').textContent = data.desc;
                
                
                modalImg.src = ""; 
                modalImg.src = data.img;

                modal.classList.add('active');
            }
        });
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

   
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', () => {
        const op = document.getElementById('operacion').value;
        const tipo = document.getElementById('tipo').value;
        const ubi = document.getElementById('ubicacion').value;

        if(!op && !tipo && !ubi) {
            alert("⚠️ Seleccioná algún filtro primero ⚠️");
            return;
        }
        
       
        const iconOriginal = searchBtn.innerHTML;
        searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        setTimeout(() => {
            alert(`🔍 Buscando: ${op || 'Todo'} - ${tipo || 'Todo'} - ${ubi || 'Cualquier zona'}`);
            searchBtn.innerHTML = iconOriginal;
        }, 1000);
    });

    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    
    const chatFab = document.getElementById('chatFab');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    
    chatFab.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    
    const addMessage = (text, sender) => {
        if (!text.trim()) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('msg', sender === 'user' ? 'user-msg' : 'ai-msg');
        msgDiv.innerHTML = `<p>${text}</p>`;
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    };

    
    const handleSend = async () => {
        const text = chatInput.value;
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        const loadingId = Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('msg', 'ai-msg');
        msgDiv.id= `load-${loadingId}`;
        msgDiv.innerHTML = `<p><i class="fa-solid fa-spinner fa-spin"></i> Pensando...</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('https://inmobiliaria-v3om.onrender.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text})
            });

            const data = await response.json();

            document.getElementById (`load-${loadingId}`).innerHTML = `<p>${data.reply}</p>`; 

        } catch (error) {
            console.error("Error conectando al backend:", error);
            document.getElementById(`load-${loadingId}`).innerHTML = `<p>Error de conexión. Intenta de nuevo o consulte con el proveedor.</p>`;
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>BLK Marketplace</title>
    <style>
        /* 
        STYLES GÉNÉRAUX
         */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; padding-bottom: 80px; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
        .kente { height: 6px; background: linear-gradient(90deg, #FFD700 20%, #2ECC71 40%, #E74C3C 60%, #FFD700 80%); position: fixed; top: 0; left: 0; right: 0; z-index: 9999; }
        .btn { padding: 14px; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; width: 100%; background: #E74C3C; color: white; transition: all 0.3s ease; font-family: inherit; font-size: 16px; }
        .btn:active { transform: scale(0.96); }
        .btn-primary { background: #E74C3C; color: white; }
        .btn-success { background: #2ECC71; color: white; }
        .btn-danger { background: #E74C3C; color: white; }
        .btn-outline { background: transparent; border: 2px solid #E74C3C; color: #E74C3C; }
        .btn-sm { padding: 6px 12px; font-size: 12px; width: auto; }
        .glass { background: rgba(255,255,255,0.8); border-radius: 20px; padding: 20px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.4); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        .empty { text-align: center; color: #999; padding: 20px; }
        .icon-inline { display: inline-flex; width: 14px; height: 14px; vertical-align: -2px; }
        .icon-inline svg { width: 100%; height: 100%; }
        .icon-inline-md { display: inline-flex; width: 18px; height: 18px; vertical-align: -4px; }
        .icon-inline-md svg { width: 100%; height: 100%; }
        .icon-inline-lg { display: inline-flex; width: 26px; height: 26px; }
        .icon-inline-lg svg { width: 100%; height: 100%; }

    .tab-intro-toast {
        position: fixed;
        top: 18px;
        right: 14px;
        max-width: 230px;
        background: rgba(20,20,20,0.94);
        color: #fff;
        padding: 14px 16px;
        border-radius: 16px;
        font-size: 13px;
        line-height: 1.45;
        z-index: 5000;
        box-shadow: 0 12px 30px rgba(0,0,0,0.35);
        opacity: 0;
        transform: translateY(-12px);
        transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        pointer-events: none;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .tab-intro-toast.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
    .tab-intro-toast .tab-intro-title { font-weight: 800; margin-bottom: 4px; color: #FFD700; font-size: 13px; }

    .confirm-anim-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.55);
        display: none; align-items: center; justify-content: center;
        z-index: 6000; opacity: 0; transition: opacity 0.25s ease;
    }
    .confirm-anim-overlay.visible { display: flex; opacity: 1; }
    .confirm-anim-card {
        background: white; border-radius: 24px; padding: 32px 28px;
        text-align: center; max-width: 280px;
        transform: scale(0.7); opacity: 0;
        transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
    }
    .confirm-anim-overlay.visible .confirm-anim-card { transform: scale(1); opacity: 1; }
    .confirm-anim-card img { width: 120px; height: auto; margin-bottom: 16px; animation: confirmBounce 1s ease 0.15s; }
    .confirm-anim-card h3 { font-size: 18px; font-weight: 800; color: #1a1a1a; margin-bottom: 6px; }
    .confirm-anim-card p { font-size: 14px; color: #999; }
    @keyframes confirmBounce {
        0% { transform: translateY(0) scale(1); }
        30% { transform: translateY(-14px) scale(1.05); }
        50% { transform: translateY(0) scale(1); }
        70% { transform: translateY(-6px) scale(1.02); }
        100% { transform: translateY(0) scale(1); }
    }
    .alert { display: none; align-items: center; gap: 10px; }
    .alert-icon { width: 18px; height: 18px; flex-shrink: 0; }
    .alert-icon svg { width: 100%; height: 100%; }

    /* ============================================================
    AUTH (inscription) - avec image de fond
    ============================================================ */
    .auth-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #2d1506;
        padding: 20px;
        margin: 0;
        position: relative;
        overflow: hidden;
    }
    /* Image de fond de la page d'inscription (motif africain) */
    .auth-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 0;
    }
    .auth-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(180deg, rgba(30,14,4,0.55) 0%, rgba(30,14,4,0.75) 60%, rgba(20,9,3,0.9) 100%);
        z-index: 0;
    }
    .auth-card {
        position: relative;
        z-index: 1;
        max-width: 400px;
        width: 100%;
        background: rgba(35,18,8,0.55);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255,215,0,0.18);
        border-radius: 32px;
        padding: 36px 28px 28px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        text-align: center;
    }
    .auth-logo-img {
        width: 84px;
        height: 84px;
        object-fit: contain;
        margin-bottom: 8px;
        filter: drop-shadow(0 6px 16px rgba(255,140,0,0.35));
    }
    .auth-wordmark {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: 0.3px;
        margin-bottom: 20px;
    }
    .auth-wordmark .wm-blk { color: #FFD700; }
    .auth-wordmark .wm-rest { color: #fff8ec; font-weight: 700; }
    .auth-title {
        font-size: 26px;
        font-weight: 300;
        color: #fff8ec;
        line-height: 1.3;
        margin-bottom: 4px;
    }
    .auth-title span {
        font-weight: 800;
        background: linear-gradient(135deg, #FFD700, #FF8C00);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .auth-subtitle {
        font-size: 14px;
        color: rgba(255,248,236,0.65);
        margin-bottom: 28px;
        font-weight: 400;
        letter-spacing: 0.3px;
    }
    .auth-input-group { margin-bottom: 12px; }
    .auth-input-group input { width: 100%; padding: 16px 18px; border: 1px solid rgba(255,215,0,0.15); border-radius: 30px; font-size: 15px; background: rgba(0,0,0,0.25); transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); outline: none; color: #fff8ec; font-family: inherit; }
    .auth-input-group input:focus { border-color: #FFD700; background: rgba(0,0,0,0.35); box-shadow: 0 0 0 4px rgba(255,215,0,0.12); transform: scale(1.01); }
    .auth-input-group input::placeholder { color: rgba(255,248,236,0.4); transition: opacity 0.3s ease; }
    .auth-input-group input:focus::placeholder { opacity: 0.5; }
    .auth-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #FFD700, #FFC300); border: none; border-radius: 30px; color: #4a1d00; font-size: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); margin-top: 10px; font-family: inherit; position: relative; overflow: hidden; }
    .auth-btn::after { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: rgba(255,255,255,0.25); border-radius: 50%; transform: translate(-50%,-50%); transition: width 0.6s ease, height 0.6s ease; }
    .auth-btn:hover::after { width: 300px; height: 300px; }
    .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,193,0,0.35); }
    .auth-btn:active { transform: scale(0.97); }
    .auth-btn-arrow { font-size: 18px; transition: transform 0.3s ease; display: inline-block; }
    .auth-btn:hover .auth-btn-arrow { transform: translateX(4px); }
    .auth-footer { margin-top: 28px; font-size: 14px; font-weight: 700; color: #1a1a1a; letter-spacing: 2px; opacity: 0.4; }
    #authError { color: #E74C3C; font-size: 14px; margin-top: 8px; display: none; }
    @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
    #authError.shake { animation: shake 0.4s ease; }
    @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
    @keyframes slideUp { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
    .animate-in { animation: fadeIn 0.8s ease forwards; }
    .fade-in { opacity: 0; animation: fadeIn 0.6s ease forwards; }
    .slide-up { opacity: 0; animation: slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

    /* ============================================================
    SPLASH SCREEN
    ============================================================ */
    .splash-screen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        background: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%);
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        animation: splashIn 1.2s ease forwards;
    }
    .splash-screen.active { display: flex; }
    .splash-logo { width: 260px; height: 260px; object-fit: contain; animation: logoPulse 1.5s ease infinite alternate; filter: drop-shadow(0 10px 40px rgba(0,0,0,0.2)); }
    /* Fallback si l'image manque */
    .splash-logo-fallback { font-size: 80px; font-weight: 900; color: #1a1a1a; text-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .splash-content h1 { font-size: 56px; font-weight: 900; color: #1a1a1a; margin: 12px 0 0; letter-spacing: -2px; }
    .splash-tagline { font-size: 18px; color: rgba(26,26,26,0.7); font-weight: 500; letter-spacing: 4px; text-transform: uppercase; }
    @keyframes splashIn { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes logoPulse { 0% { transform: scale(1); } 100% { transform: scale(1.05); } }
    @keyframes splashOut { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.2); } }
    .splash-screen.hiding { animation: splashOut 0.6s ease forwards; }

    /* ============================================================
    APPLICATION PRINCIPALE
    ============================================================ */
    .app {
        display: none;
        max-width: 600px;
        margin: 0 auto;
        padding: 80px 16px 100px;
    }
    .app.active { display: block; }

    /* ============================================================
    EN-TÊTE AVEC LOGO ET BARRE DE RECHERCHE
    ============================================================ */
    .home-header {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 4px 2px 6px;
        margin-bottom: 16px;
    }
    .brand-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-left: 4px;
    }
    .brand-logo-img { width: 54px; height: 54px; object-fit: contain; }
    .brand-logo-text { font-size: 28px; font-weight: 800; color: #1a1a1a; letter-spacing: 0.3px; }
    .search-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 20px;
        border-radius: 30px;
        background: linear-gradient(160deg, rgba(255,105,90,0.92) 0%, rgba(210,20,20,0.94) 55%, rgba(150,10,10,0.95) 100%);
        box-shadow: 0 10px 26px rgba(200,20,20,0.35), inset 0 1px 1px rgba(255,255,255,0.35);
        border: 1px solid rgba(255,255,255,0.25);
        position: relative;
        overflow: hidden;
    }
    .search-bar::before {
        content: '';
        position: absolute;
        top: 2px; left: 8%; right: 8%;
        height: 40%;
        background: linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0));
        border-radius: 20px;
        pointer-events: none;
    }
    .search-icon { width: 20px; height: 20px; color: rgba(255,225,205,0.95); flex-shrink: 0; position: relative; z-index: 1; }
    .search-icon svg { width: 100%; height: 100%; }
    .search-bar input {
        flex: 1;
        padding: 2px 0;
        border: none;
        background: transparent;
        font-size: 16px;
        outline: none;
        font-family: inherit;
        color: #fff6ef;
        position: relative;
        z-index: 1;
    }
    .search-bar input::placeholder { color: rgba(255,236,227,0.75); }

    /* ============================================================
    PROFIL VENDEUR (intégré dans la liste des articles)
    ============================================================ */
    .seller-profile-card {
        grid-column: 1 / -1;
        background: rgba(255,255,255,0.9);
        border-radius: 20px;
        padding: 20px;
        margin-bottom: 4px;
        border: 1px solid rgba(255,255,255,0.4);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
    }
    .seller-avatar-small {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        overflow: hidden;
        background: #2d2d2d;
        flex-shrink: 0;
        border: 2px solid #FFD700;
    }
    .seller-avatar-small img { width: 100%; height: 100%; object-fit: cover; }
    .seller-info-small { flex: 1; min-width: 120px; }
    .seller-info-small h3 { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
    .seller-info-small p { font-size: 12px; color: #999; margin: 2px 0; }
    .seller-stats-small { display: flex; gap: 16px; font-size: 12px; color: #555; }
    .seller-stats-small span { font-weight: 600; }
    .seller-actions-small { display: flex; gap: 8px; margin-left: auto; }
    .btn-follow-small { padding: 6px 16px; border: none; border-radius: 30px; background: #FFD700; color: #1a1a1a; font-weight: 700; font-size: 12px; cursor: pointer; transition: all 0.3s ease; font-family: inherit; }
    .btn-follow-small:active { transform: scale(0.94); }
    .btn-follow-small.following { background: rgba(0,0,0,0.1); color: #555; }
    .btn-message-small { padding: 6px 10px; border: none; border-radius: 30px; background: rgba(0,0,0,0.05); color: #1a1a1a; font-size: 16px; cursor: pointer; transition: all 0.3s ease; font-family: inherit; }
    .btn-message-small:active { transform: scale(0.92); }

    /* ============================================================
    ARTICLES EN GRILLE
    ============================================================ */
    .articles-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 8px;
    }
    .article-card {
        background: rgba(255,255,255,0.85);
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.4);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }
    .article-card:active { transform: scale(0.96); }
    .article-card img { width: 100%; aspect-ratio: 1 / 1; height: auto; object-fit: cover; display: block; }
    .article-card .info { padding: 12px; }
    .article-card .title { font-weight: 700; font-size: 14px; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .article-card .price { font-weight: 800; color: #E74C3C; font-size: 16px; margin-top: 2px; }

    /* ============================================================
    STATISTIQUES DU MAGASIN
    ============================================================ */
    .shop-stats { padding: 16px 0; margin-bottom: 16px; }
    .shop-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .stat-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 16px; padding: 16px 14px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 2px 12px rgba(0,0,0,0.04); transition: all 0.3s ease; position: relative; overflow: hidden; }
    .stat-sales { background: linear-gradient(135deg, rgba(52,152,219,0.12) 0%, rgba(52,152,219,0.04) 100%); border-color: rgba(52,152,219,0.2); }
    .stat-sales .stat-card-number { color: #2980b9; }
    .stat-published { background: linear-gradient(135deg, rgba(46,204,113,0.12) 0%, rgba(46,204,113,0.04) 100%); border-color: rgba(46,204,113,0.2); }
    .stat-published .stat-card-number { color: #27ae60; }
    .stat-revenue { background: linear-gradient(135deg, rgba(241,196,15,0.12) 0%, rgba(241,196,15,0.04) 100%); border-color: rgba(241,196,15,0.2); }
    .stat-revenue .stat-card-number { color: #f39c12; }
    .stat-orders { background: linear-gradient(135deg, rgba(231,76,60,0.12) 0%, rgba(231,76,60,0.04) 100%); border-color: rgba(231,76,60,0.2); }
    .stat-orders .stat-card-number { color: #c0392b; }
    .stat-sales .stat-card-icon { color: #2980b9; }
    .stat-published .stat-card-icon { color: #27ae60; }
    .stat-revenue .stat-card-icon { color: #f39c12; }
    .stat-orders .stat-card-icon { color: #c0392b; }
    .stat-card-icon { font-size: 28px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.6); border-radius: 12px; flex-shrink: 0; }
    .stat-card-content { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .stat-card-number { font-size: 22px; font-weight: 800; line-height: 1.2; transition: all 0.3s ease; }
    .stat-card-label { font-size: 12px; color: #999; font-weight: 500; letter-spacing: 0.3px; margin-top: 2px; }
    .stat-card { animation: statFadeIn 0.6s ease backwards; }
    .stat-card:nth-child(1) { animation-delay: 0.05s; }
    .stat-card:nth-child(2) { animation-delay: 0.10s; }
    .stat-card:nth-child(3) { animation-delay: 0.15s; }
    .stat-card:nth-child(4) { animation-delay: 0.20s; }
    @keyframes statFadeIn { 0% { opacity: 0; transform: translateY(12px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }

    /* ============================================================
    MODAL POUR AGRANDIR UN ARTICLE
    ============================================================ */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: none; align-items: center; justify-content: center; z-index: 2000; padding: 20px; animation: modalFadeIn 0.3s ease; }
    .modal-overlay.active { display: flex; }
    @keyframes modalFadeIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
    .modal-content { max-width: 400px; width: 100%; background: white; border-radius: 24px; overflow: hidden; position: relative; max-height: 90vh; overflow-y: auto; }
    .modal-close { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.5); border: none; border-radius: 50%; width: 36px; height: 36px; color: white; font-size: 20px; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); transition: all 0.3s ease; font-family: inherit; }
    .modal-close:active { transform: scale(0.9); }
    .modal-gallery { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .modal-gallery::-webkit-scrollbar { display: none; }
    .modal-gallery img { width: 100%; flex: 0 0 100%; height: 300px; object-fit: cover; display: block; scroll-snap-align: start; }
    .modal-gallery-dots { display: flex; justify-content: center; gap: 6px; padding: 10px 0 4px; }
    .modal-gallery-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(0,0,0,0.15); transition: all 0.2s ease; }
    .modal-gallery-dots span.active { background: #E74C3C; width: 16px; border-radius: 3px; }
    .modal-info h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .modal-seller-card { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding: 10px; background: rgba(0,0,0,0.03); border-radius: 14px; }
    .modal-seller-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #FFD700, #FF8C00); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
    .modal-seller-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .modal-seller-avatar span { color: white; font-weight: 800; font-size: 16px; }
    .modal-seller-name { font-weight: 700; font-size: 14px; color: #1a1a1a; }
    .modal-seller-meta { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #777; margin-top: 2px; }
    .discussion-product-card { display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(0,0,0,0.03); border-radius: 14px; margin-bottom: 10px; }
    .discussion-product-card img { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
    .discussion-product-card .dp-info { flex: 1; min-width: 0; }
    .discussion-product-card .dp-title { font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .discussion-product-card .dp-price { font-weight: 800; color: #E74C3C; font-size: 13px; }
    .discussion-product-card button { flex-shrink: 0; padding: 8px 14px; border: none; border-radius: 20px; background: #E74C3C; color: white; font-weight: 700; font-size: 12px; cursor: pointer; }
    #btnRecordVoice.recording { background: #E74C3C; color: white; border-color: #E74C3C; animation: micPulse 1s ease infinite; }
    @keyframes micPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
    .modal-info { padding: 20px; }
    .modal-info h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .modal-info .modal-price { font-size: 20px; font-weight: 800; color: #E74C3C; margin-bottom: 12px; }
    .btn-buy { width: 100%; padding: 14px; border: none; border-radius: 14px; background: #E74C3C; color: white; font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.3s ease; font-family: inherit; }
    .btn-buy:active { transform: scale(0.96); }

    /* ============================================================
    SWIPE POPUP
    ============================================================ */
    /* ============================================================
    BARRE DE NAVIGATION (TABS) - effet glass rouge + bulle flottante
    ============================================================ */
    .tab-bar {
        position: fixed;
        bottom: 14px;
        left: 12px;
        right: 12px;
        z-index: 1000;
        display: none; /* Masqué par défaut */
    }
    .tab-bar.show { display: flex; }
    .tab-slider {
        display: flex;
        justify-content: space-around;
        align-items: center;
        max-width: 600px;
        margin: 0 auto;
        position: relative;
        padding: 10px 8px;
        width: 100%;
        border-radius: 32px;
        background: linear-gradient(115deg, #EA6113 0%, #F88F22 38%, #FBB931 68%, #FFE3B3 100%);
        box-shadow: 0 14px 34px rgba(234,97,19,0.4), 0 4px 10px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.45);
        border: 1px solid rgba(255,255,255,0.3);
        overflow: visible;
    }
    .tab-slider::before {
        content: '';
        position: absolute;
        top: 3px; left: 10%; right: 10%;
        height: 40%;
        background: linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0));
        border-radius: 30px;
        pointer-events: none;
    }
    .tab-bubble {
        position: absolute;
        top: -26px;
        left: 0;
        width: 52px;
        height: 52px;
        border-radius: 18px;
        background: radial-gradient(circle at 32% 28%, #3d3d3d, #0a0a0a 70%);
        box-shadow: 0 10px 20px rgba(0,0,0,0.45), 0 0 0 4px rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        transform: translateX(0px);
        z-index: 3;
        pointer-events: none;
    }
    .tab-bubble-icon { width: 22px; height: 22px; color: #fff; display: flex; }
    .tab-bubble-icon svg { width: 100%; height: 100%; }
    .tab-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; background: none; border: none; padding: 4px 6px; cursor: pointer; position: relative; z-index: 2; flex: 1; transition: all 0.3s ease; -webkit-tap-highlight-color: transparent; touch-action: manipulation; font-family: inherit; }
    .tab-icon-svg { width: 22px; height: 22px; color: rgba(74,32,0,0.72); transition: opacity 0.25s ease, transform 0.25s ease; }
    .tab-icon-svg svg { width: 100%; height: 100%; }
    .tab-label { font-size: 10px; font-weight: 600; color: rgba(74,32,0,0.72); letter-spacing: 0.3px; transition: color 0.3s ease; white-space: nowrap; }
    .tab-item.active .tab-icon-svg { opacity: 0; transform: scale(0.6); }
    .tab-item.active .tab-label { color: #3a1d00; font-weight: 800; }
    .tab-item:active { transform: scale(0.92); transition: transform 0.1s ease; }


    /* ============================================================
    PAGE PROFIL - NOUVEAU DESIGN
    ============================================================ */
    #pageProfile {
        position: relative;
        padding: 16px;
        overflow: hidden;
    }
    .profile-watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 0;
        opacity: 0.04;
        pointer-events: none;
        user-select: none;
    }
    .watermark-text { font-size: 120px; font-weight: 900; color: #1a1a1a; letter-spacing: -4px; }
    .profile-header-new { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; position: relative; z-index: 1; }
    .profile-avatar-new { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #FFD700, #FF8C00); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: white; box-shadow: 0 4px 20px rgba(255,215,0,0.3); flex-shrink: 0; }
    .profile-info-new h2 { font-size: 20px; font-weight: 700; margin-bottom: 2px; color: #1a1a1a; }
    .profile-info-new p { font-size: 14px; color: #999; margin: 2px 0; }
    .wallet-card { background: linear-gradient(145deg, #1a1a1a, #2d2d2d); border-radius: 24px; padding: 24px 20px 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); margin-bottom: 24px; position: relative; z-index: 1; transition: transform 0.3s ease; border: 1px solid rgba(255,255,255,0.06); }
    .wallet-card:active { transform: scale(0.99); }
    .wallet-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 4px; }
    .wallet-label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
    .balance-cards { position: relative; height: 150px; margin: 16px 4px 22px; }
    .balance-card-back {
        position: absolute; top: 0; right: 6%; width: 78%; height: 66%;
        border-radius: 20px;
        background: linear-gradient(135deg, #FF7A45, #E63900);
        box-shadow: 0 14px 30px rgba(230,57,0,0.35);
    }
    .balance-card-front {
        position: absolute; bottom: 0; left: 0; width: 82%; height: 74%;
        border-radius: 20px;
        background: rgba(255,255,255,0.10);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255,255,255,0.22);
        padding: 16px 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    .balance-amount-row { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
    .balance-dashes { display: flex; gap: 8px; }
    .balance-dashes span { width: 22px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.5); }
    .wallet-balance-new { font-size: 32px; font-weight: 900; color: #FFD700; line-height: 1.1; transition: all 0.3s ease; }
    .wallet-balance-new.updated { animation: walletPulse 0.5s ease; }
    @keyframes walletPulse { 0% { transform: scale(1); } 50% { transform: scale(1.08); color: #FF8C00; } 100% { transform: scale(1); } }
    .wallet-currency { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.3); margin-top: 2px; }
    .wallet-delta-badge { margin-top: 8px; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: rgba(255,255,255,0.06); }
    .wallet-delta-badge.up { color: #2ECC71; }
    .wallet-delta-badge.down { color: #E74C3C; }
    .wallet-chart-wrap { height: 60px; margin: 4px 0 18px; }
    .wallet-chart-wrap svg { width: 100%; height: 100%; display: block; }
    .wallet-actions { display: flex; gap: 10px; justify-content: center; }
    .wallet-btn { flex: 1; padding: 12px 8px; border: none; border-radius: 14px; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: all 0.3s ease; font-family: inherit; background: rgba(255,255,255,0.06); color: white; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
    .wallet-btn:active { transform: scale(0.94); }
    .wallet-btn-icon { font-size: 20px; }
    .wallet-btn-deposit { background: rgba(46,204,113,0.15); color: #2ECC71; }
    .wallet-btn-deposit:active { background: rgba(46,204,113,0.3); }
    .wallet-btn-withdraw { background: rgba(231,76,60,0.15); color: #E74C3C; }
    .wallet-btn-withdraw:active { background: rgba(231,76,60,0.3); }
    .wallet-btn-transfer { background: rgba(52,152,219,0.15); color: #3498DB; }
    .wallet-btn-transfer:active { background: rgba(52,152,219,0.3); }
    .profile-stats-new { display: flex; gap: 16px; justify-content: space-around; background: rgba(255,255,255,0.6); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 20px; padding: 16px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.3); position: relative; z-index: 1; }
    .stat-item-new { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .stat-number-new { font-size: 22px; font-weight: 800; color: #1a1a1a; }
    .stat-label-new { font-size: 11px; color: #999; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }

    /* ============================================================
    PAGES
    ============================================================ */
    .page { display: none; }
    .page.active { display: block; }

    /* ============================================================
    ALERTES
    ============================================================ */
    .alert { padding: 12px; border-radius: 12px; margin-bottom: 12px; display: none; font-size: 14px; align-items: center; gap: 8px; }
    .alert.active-flex { display: flex; }
    .alert-icon { width: 18px; height: 18px; flex-shrink: 0; }
    .alert-icon svg { width: 100%; height: 100%; }
    .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .alert-info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }

    /* ============================================================
    CHART
    ============================================================ */
    .chart-container { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding: 8px 0; }
    .chart-bar { flex: 1; background: #E74C3C; border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.3s ease; }

    /* Graphique temps réel (Mon Magasin) */
    .stats-chart-card { padding: 20px 16px; }
    .stats-chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .stats-chart-header h4 { font-size: 15px; }
    .stats-chart-live { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #2ECC71; letter-spacing: 0.3px; }
    .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #2ECC71; animation: livePulse 1.4s ease infinite; }
    @keyframes livePulse { 0% { box-shadow: 0 0 0 0 rgba(46,204,113,0.5); } 70% { box-shadow: 0 0 0 6px rgba(46,204,113,0); } 100% { box-shadow: 0 0 0 0 rgba(46,204,113,0); } }
    .stats-chart-legend { display: flex; gap: 24px; margin-bottom: 6px; flex-wrap: wrap; }
    .legend-label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #999; letter-spacing: 0.5px; }
    .legend-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
    .legend-value { font-size: 22px; font-weight: 800; color: #1a1a1a; display: flex; align-items: baseline; gap: 6px; margin-top: 2px; }
    .legend-delta { font-size: 12px; font-weight: 700; }
    .legend-delta.up { color: #27ae60; }
    .legend-delta.down { color: #E74C3C; }
    .chart-svg-wrap { position: relative; margin-top: 8px; }
    .chart-svg-wrap svg { width: 100%; height: 160px; display: block; overflow: visible; }
    .chart-tooltip {
        position: absolute; pointer-events: none; background: rgba(20,20,20,0.92); color: #fff;
        border-radius: 12px; padding: 10px 14px; font-size: 12px; transform: translate(-50%, -110%);
        white-space: nowrap; opacity: 0; transition: opacity 0.15s ease; z-index: 5;
    }
    .chart-tooltip.visible { opacity: 1; }
    .chart-tooltip .tt-date { font-weight: 700; margin-bottom: 4px; }
    .chart-tooltip .tt-row { display: flex; align-items: center; gap: 6px; }
    .chart-tooltip .tt-row + .tt-row { margin-top: 2px; }
    .chart-tooltip .tt-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 16px; }
    .stat-card-old { background: rgba(255,255,255,0.8); border-radius: 14px; padding: 16px; text-align: center; border: 1px solid rgba(255,255,255,0.4); }
    .stat-card-old .number { font-size: 28px; font-weight: 800; color: #E74C3C; }
    .stat-card-old .label { font-size: 12px; color: #999; }

    /* ============================================================
    RESPONSIVE
    ============================================================ */
    @media (max-width: 420px) {
        .auth-card { padding: 28px 20px 24px; border-radius: 24px; }
        .auth-title { font-size: 24px; }
        .auth-input-group input { padding: 14px 16px; font-size: 14px; }
        .auth-btn { padding: 14px; font-size: 15px; }
        .seller-profile-card { flex-direction: column; align-items: center; text-align: center; }
        .seller-actions-small { margin-left: 0; }
        .shop-stats-grid { gap: 8px; }
        .stat-card { padding: 12px 10px; gap: 8px; }
        .stat-card-icon { font-size: 22px; width: 40px; height: 40px; }
        .stat-card-number { font-size: 18px; }
        .stat-card-label { font-size: 10px; }
        .articles-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .article-card img { aspect-ratio: 1 / 1; }
        .tab-icon-svg { width: 19px; height: 19px; }
        .tab-label { font-size: 9px; }
        .tab-item { padding: 2px 4px; }
        .tab-bubble { width: 46px; height: 46px; top: -24px; border-radius: 16px; }
        .tab-bubble-icon { width: 19px; height: 19px; }
        .modal-gallery img { height: 200px; }
        .watermark-text { font-size: 80px; }
        .wallet-balance-new { font-size: 32px; }
        .wallet-btn { font-size: 11px; padding: 10px 6px; }
        .wallet-btn-icon { font-size: 18px; }
        .profile-avatar-new { width: 60px; height: 60px; font-size: 26px; }
        .profile-info-new h2 { font-size: 17px; }
        .profile-stats-new { padding: 12px; gap: 8px; }
        .stat-number-new { font-size: 18px; }
    }
    @media (min-width: 500px) {
        .shop-stats-grid { grid-template-columns: repeat(4, 1fr); }
        .articles-grid { grid-template-columns: repeat(3, 1fr); }
    }
</style>
</head>
<body>
    <div class="kente"></div>

<!-- ============================================================
SPLASH SCREEN
============================================================ -->
<div class="splash-screen" id="splashScreen">
    <div class="splash-content">
        <img src="logo_blk.png" alt="BLK Marketplace" class="splash-logo" id="splashLogo" onerror="this.style.display='none'; document.getElementById('splashFallback').style.display='block';">
        <span class="splash-logo-fallback" id="splashFallback" style="display:none;">BLK</span>
    </div>
    <audio id="splashSound" preload="auto">
        <source src="jingle.mp3" type="audio/mpeg">
    </audio>
</div>

<!-- ============================================================
AUTH
============================================================ -->
<div class="auth-page" id="authPage">
    <div class="auth-background" id="authBackgroundDiv"></div>
    <div class="auth-overlay"></div>
    <div class="auth-card animate-in">
        <img src="" alt="BLK" id="authLogoImg" class="auth-logo-img fade-in" style="animation-delay: 0.05s;">
        <div class="auth-wordmark fade-in" style="animation-delay: 0.08s;"><span class="wm-blk">BLK</span><span class="wm-rest">marketplace</span></div>
        <h1 class="auth-title slide-up" style="animation-delay: 0.1s;">Welcome to <br><span>BLKmarketplace</span></h1>
        <p class="auth-subtitle slide-up" style="animation-delay: 0.2s;">Shop unique finds with an African touch.</p>
        <form id="authForm" autocomplete="off">
            <div class="auth-input-group slide-up" style="animation-delay: 0.3s;">
                <input type="text" id="loginName" placeholder="Nom complet" value="Divin Ambeto" required>
            </div>
            <div class="auth-input-group slide-up" style="animation-delay: 0.35s;">
                <input type="email" id="loginEmail" placeholder="Adresse e-mail" value="ambetodivin9@gmail.com" required>
            </div>
            <button type="submit" class="auth-btn slide-up" style="animation-delay: 0.4s;" id="btnLogin">
                Se connecter <span class="auth-btn-arrow icon-inline" data-ic="arrowRight"></span>
            </button>
        </form>
        <div id="authError"></div>
    </div>
</div>

<!-- ============================================================
APP
============================================================ -->
<div class="app" id="appContainer">
    <div id="alertBox" class="alert"><span class="alert-icon" id="alertIcon"></span><span id="alertText"></span></div>

    <!-- PAGE ACCUEIL -->
    <div class="page active" id="pageHome">
        <!-- LOGO + BARRE DE RECHERCHE -->
        <div class="home-header">
            <div class="brand-row">
                <img src="" alt="BLK" id="logoMiniImg" class="brand-logo-img">
                <span class="brand-logo-text">BLK</span>
            </div>
            <div class="search-bar">
                <span class="search-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                <input type="text" id="searchInput" placeholder="Rechercher...">
            </div>
        </div>

        <!-- CATÉGORIES -->
        <div id="categoryFilters" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
            <button class="btn btn-sm btn-primary" data-cat="all">Tous</button>
            <button class="btn btn-sm btn-outline" data-cat="vêtements">Vêtements</button>
            <button class="btn btn-sm btn-outline" data-cat="chaussures">Chaussures</button>
            <button class="btn btn-sm btn-outline" data-cat="sacs">Sacs</button>
            <button class="btn btn-sm btn-outline" data-cat="bijoux">Bijoux</button>
            <button class="btn btn-sm btn-outline" data-cat="accessoires">Accessoires</button>
        </div>

        <!-- ARTICLES -->
        <div id="productsGrid" class="articles-grid"></div>
        <div id="emptyHome" class="empty" style="display:none;">Aucun article</div>
    </div>

    <!-- PAGE MON MAGASIN -->
    <div class="page" id="pageShop">
        <h2 style="color:#E74C3C; margin-bottom:8px;">Mon Magasin</h2>
        <button class="btn btn-primary" id="btnPublish" style="margin-bottom:16px;"><span class="icon-inline" data-ic="send"></span> Publier un article</button>

        <!-- STATISTIQUES -->
        <div class="shop-stats">
            <div class="shop-stats-grid">
                <div class="stat-card stat-sales">
                    <div class="stat-card-icon"><span class="icon-inline-lg" data-ic="box"></span></div>
                    <div class="stat-card-content">
                        <span class="stat-card-number" id="statTotalSales">0</span>
                        <span class="stat-card-label">Articles vendus</span>
                    </div>
                </div>
                <div class="stat-card stat-published">
                    <div class="stat-card-icon"><span class="icon-inline-lg" data-ic="note"></span></div>
                    <div class="stat-card-content">
                        <span class="stat-card-number" id="statTotalArticles">0</span>
                        <span class="stat-card-label">Articles publiés</span>
                    </div>
                </div>
                <div class="stat-card stat-revenue">
                    <div class="stat-card-icon"><span class="icon-inline-lg" data-ic="coin"></span></div>
                    <div class="stat-card-content">
                        <span class="stat-card-number" id="statTotalRevenue">0</span>
                        <span class="stat-card-label">Chiffre d'affaires</span>
                    </div>
                </div>
                <div class="stat-card stat-orders">
                    <div class="stat-card-icon"><span class="icon-inline-lg" data-ic="cart"></span></div>
                    <div class="stat-card-content">
                        <span class="stat-card-number" id="statTotalOrders">0</span>
                        <span class="stat-card-label">Commandes passées</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- GRAPHIQUE TEMPS RÉEL -->
        <div class="glass stats-chart-card">
            <div class="stats-chart-header">
                <h4><span class="icon-inline-md" data-ic="chartUp"></span> Évolution de la boutique</h4>
                <span class="stats-chart-live"><span class="live-dot"></span>Temps réel</span>
            </div>
            <div class="stats-chart-legend">
                <div class="legend-item">
                    <div class="legend-label"><span class="legend-dot" style="background:#3B82F6;"></span>VENTES</div>
                    <div class="legend-value"><span id="chartVentesTotal">0</span><span class="legend-delta" id="chartVentesDelta"></span></div>
                </div>
                <div class="legend-item">
                    <div class="legend-label"><span class="legend-dot" style="background:#E74C3C;"></span>REVENU</div>
                    <div class="legend-value"><span id="chartRevenuTotal">0</span><span class="legend-delta" id="chartRevenuDelta"></span></div>
                </div>
            </div>
            <div id="chartSvgWrap" class="chart-svg-wrap"></div>
            <div id="statsEmpty" class="empty" style="display:none;">Aucune donnée</div>
        </div>

        <div id="shopArticles" style="margin-top:12px;"></div>
    </div>

    <!-- PAGE MESSAGERIE -->
    <div class="page" id="pageMessages">
        <h2 style="color:#E74C3C;">Messagerie</h2>
        <div id="contactsList" style="display:flex; flex-wrap:wrap; margin-bottom:12px;"></div>
        <div id="discussionView" style="display:none;">
            <div class="glass">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <h3 id="discussionName">Utilisateur</h3>
                    <button class="btn btn-sm btn-outline" id="btnCloseDiscussion"><span class="icon-inline" data-ic="cross"></span></button>
                </div>
                <div id="discussionProductCard" class="discussion-product-card" style="display:none;"></div>
                <div id="messagesList" style="max-height:300px; overflow-y:auto; padding:4px 0;"></div>
                <div style="display:flex; gap:8px; margin-top:8px;">
                    <input type="text" id="messageInput" placeholder="Écris ton message..." style="flex:1; padding:12px; border:1px solid #ddd; border-radius:14px; font-size:16px;">
                    <button class="btn btn-outline" id="btnRecordVoice" type="button" title="Message vocal" style="width:auto; padding:12px 14px;"></button>
                    <button class="btn btn-primary" id="btnSendMessage" style="width:auto; padding:12px 20px;">Envoyer</button>
                </div>
            </div>
        </div>
        <div id="emptyMessages" class="empty" style="display:block;">Aucune discussion</div>
    </div>

    <!-- PAGE MES COMMANDES -->
    <div class="page" id="pageOrders">
        <h2 style="color:#E74C3C;">Mes Commandes</h2>
        <div id="ordersList"></div>
        <div id="emptyOrders" class="empty" style="display:none;">Aucune commande</div>
    </div>

    <!-- PAGE PROFIL -->
    <div class="page" id="pageProfile">
        <div class="profile-watermark"><span class="watermark-text">BLK</span></div>

        <div class="profile-header-new">
            <div class="profile-avatar-new" id="profileAvatarNew"><span id="profileAvatarLetter">D</span></div>
            <div class="profile-info-new">
                <h2 id="profileNameNew">Divin Ambeto</h2>
                <p id="profileEmailNew">ambetodivin9@gmail.com</p>
                <p id="profilePhoneNew">+242 06 591 8166</p>
            </div>
        </div>

        <!-- CARTE WALLET -->
        <div class="wallet-card">
            <div class="wallet-header">
                <span class="wallet-label"><span class="icon-inline-md" data-ic="coin"></span> Wallet BLK</span>
            </div>
            <div class="balance-cards">
                <div class="balance-card-back"></div>
                <div class="balance-card-front">
                    <div class="balance-amount-row">
                        <span class="wallet-balance-new" id="walletBalanceNew">0</span>
                        <span class="wallet-currency">FCFA</span>
                    </div>
                    <span class="wallet-delta-badge" id="walletDeltaBadge" style="display:none;"></span>
                    <div class="balance-dashes"><span></span><span></span><span></span><span></span></div>
                </div>
            </div>
            <div class="wallet-chart-wrap" id="walletChartWrap"></div>
            <div class="wallet-actions">
                <button class="wallet-btn wallet-btn-deposit" id="btnDepositNew">
                    <span class="wallet-btn-icon icon-inline-md" data-ic="receive"></span> Déposer
                </button>
                <button class="wallet-btn wallet-btn-withdraw" id="btnWithdrawNew">
                    <span class="wallet-btn-icon icon-inline-md" data-ic="send"></span> Retirer
                </button>
                <button class="wallet-btn wallet-btn-transfer" id="btnTransferNew">
                    <span class="wallet-btn-icon icon-inline-md" data-ic="transfer"></span> Transférer
                </button>
            </div>
        </div>

        <!-- STATS -->
        <div class="profile-stats-new">
            <div class="stat-item-new">
                <span class="stat-number-new" id="profileFlamesNew">0</span>
                <span class="stat-label-new"><span class="icon-inline" data-ic="flame"></span> Flammes</span>
            </div>
            <div class="stat-item-new">
                <span class="stat-number-new" id="profileFollowersNew">0</span>
                <span class="stat-label-new"><span class="icon-inline" data-ic="users"></span> Abonnés</span>
            </div>
            <div class="stat-item-new">
                <span class="stat-number-new" id="profileFollowingNew">0</span>
                <span class="stat-label-new"><span class="icon-inline" data-ic="pin"></span> Abonnements</span>
            </div>
        </div>

        <button class="btn btn-danger" id="btnLogout" style="margin-top:20px;"><span class="icon-inline" data-ic="logout"></span> Déconnexion</button>
    </div>
</div>

<!-- ============================================================
BARRE DE NAVIGATION
============================================================ -->
<div class="tab-bar" id="tabs">
    <div class="tab-slider" id="tabSlider">
        <div class="tab-bubble" id="tabBubble"><span class="tab-bubble-icon" id="tabBubbleIcon"></span></div>
        <button class="tab-item active" data-tab="pageHome" data-icon="home"><span class="tab-icon-svg"></span><span class="tab-label">Accueil</span></button>
        <button class="tab-item" data-tab="pageShop" data-icon="shop"><span class="tab-icon-svg"></span><span class="tab-label">Mon Magasin</span></button>
        <button class="tab-item" data-tab="pageMessages" data-icon="messages"><span class="tab-icon-svg"></span><span class="tab-label">Messagerie</span></button>
        <button class="tab-item" data-tab="pageOrders" data-icon="orders"><span class="tab-icon-svg"></span><span class="tab-label">Mes Commandes</span></button>
        <button class="tab-item" data-tab="pageProfile" data-icon="profile"><span class="tab-icon-svg"></span><span class="tab-label">Mon Profil</span></button>
    </div>
</div>

<!-- ============================================================
MODAL
============================================================ -->
<div class="modal-overlay" id="articleModal">
    <div class="modal-content">
        <button class="modal-close" id="modalClose"><span class="icon-inline" data-ic="cross"></span></button>
        <div class="modal-gallery" id="modalGallery"></div>
        <div class="modal-gallery-dots" id="modalGalleryDots"></div>
        <div class="modal-info">
            <h3 id="modalTitle">Titre</h3>
            <p class="modal-price" id="modalPrice">0 FCFA</p>
            <div class="modal-seller-card">
                <div class="modal-seller-avatar">
                    <img id="modalSellerAvatar" src="" alt="" style="display:none;">
                    <span id="modalSellerInitial">?</span>
                </div>
                <div class="modal-seller-info">
                    <div class="modal-seller-name" id="modalSellerName">Vendeur</div>
                    <div class="modal-seller-meta">
                        <span class="icon-inline" data-ic="flame"></span> <span id="modalFlames">0</span>
                        &nbsp;·&nbsp;
                        <span class="icon-inline" data-ic="box"></span> <span id="modalArticles">0</span> articles
                    </div>
                </div>
            </div>
            <button class="btn-buy" id="modalBuyBtn">Passer commande</button>
            <button class="btn btn-outline" id="modalChatBtn" style="margin-top:8px;">Commencer la discussion</button>
        </div>
    </div>
</div>

<div class="confirm-anim-overlay" id="confirmAnimOverlay">
    <div class="confirm-anim-card">
        <img src="data:image/png;base64,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" alt="Confirmé">
        <h3 id="confirmAnimTitle">Confirmé !</h3>
        <p id="confirmAnimSubtitle"></p>
    </div>
</div>

<!-- ============================================================
SCRIPTS
============================================================ -->
<script>
    // ============================================================
    // ASSETS (logo BLK + fond inscription fournis par l'utilisateur)
    // ============================================================
    var LOGO_DATA_URI = 'data:image/png;base64,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b28mfJF3fIEZjYi/z3ve22/x8pXn8K9xPATBGRFRpQVwn6Of/Tl9z/rJNpHe0i2ln83Hf0vMQE93H5/qfruf5b/7L+D+XBb9czkxew5f+O+5hlv6sz/l470Fz/mpy/1u0XN0ILI+ESEFn5tD9jANR9HqaP2JuA7PC+36T/hHfEeaT3k/ADsR3ofVhW7Jn463vhu5/z1xuYye0ww6pr1HtLwbqT/n3QhX08shrNwP70bYO9z/tgPupbTcEx9/3/g2Bw6gB8vjeDfC4+hGS+0sOzs0HMyuCgdouAQv0QZ3zAfe6OfXz2eboPF93uw5/BgNF+F8DOHy7bcTSfUkXo/W21w0bJwtkSQH66FrHMTZj3LvtF4id1De/HndR1Nukz+tgMoh5tbjjdcvNEttasnnjjQ8ji7PlSnc/Dkv6TI+hrwVuP9F2zfk1sd06vUfpM8ReJvTljd/Pg5hDsJhNKc9b/54T12UOP4Zl6TXNJBWtl91+u8JgiAIPtdvVrIYdD/Dk/1FYv6zzPvnsjH7ae4VkURwWyVelEFwtmdB1CX7gU8XjFragyAEKQiCW40GsY514CPA+rSJ/rPgtku8OIPgLMSToZQffw7n71R20rCxNWPnUs8H5VAZUw2CIAiCIAiCILhdRUqeHNvLf+MZCYIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCILgdsX/D82krDCOAOsqAAAAAElFTkSuQmCC';
    var AUTH_BG_DATA_URI = 'data:image/jpeg;base64,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';
    document.getElementById('splashLogo').src = LOGO_DATA_URI;
    document.getElementById('logoMiniImg').src = LOGO_DATA_URI;
    document.getElementById('authLogoImg').src = LOGO_DATA_URI;
    document.getElementById('authBackgroundDiv').style.backgroundImage = 'url(' + AUTH_BG_DATA_URI + ')';

    // ============================================================
    // ICÔNES SVG (remplace tous les emojis de l'app)
    // ============================================================
    var ICONS = {
        flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4 0 7-2.7 7-6.8 0-2.7-1.7-4.6-2.8-6.4-.6 1.7-1.5 2.6-2.4 2.6.6-2.8-.8-5.6-3.2-7 .4 2.8-1 4.8-2.8 6.6-1.3 1.4-1.8 2.8-1.8 4.2C6 19.3 8 22 12 22Z"/></svg>',
        users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M2.5 20c.7-3.5 3.4-5.5 6.5-5.5s5.8 2 6.5 5.5"/><circle cx="17.5" cy="8.8" r="2.3"/><path d="M16.3 14.7c2.4.5 4.1 2.2 4.7 4.8"/></svg>',
        box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-4.5L21 8v8l-9 4.5L3 16Z"/><path d="M3 8l9 4.5L21 8"/><path d="M12 12.5V21"/></svg>',
        chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4V5Z"/><circle cx="9" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="10.5" r="1" fill="currentColor" stroke="none"/></svg>',
        send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4"/><path d="m7 8 5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>',
        receive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="m7 11 5 5 5-5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>',
        transfer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>',
        note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V6a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M14 4v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
        coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9"/><path d="M9.3 9.3c0-1.1 1.1-1.8 2.7-1.8s2.7.8 2.7 1.8-1.2 1.5-2.7 2-2.7.8-2.7 2 1.2 1.8 2.7 1.8 2.7-.7 2.7-1.8"/></svg>',
        cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.3" fill="currentColor" stroke="none"/><circle cx="18" cy="20" r="1.3" fill="currentColor" stroke="none"/><path d="M2.5 3h2.5l2.3 11.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6"/></svg>',
        chartUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17 9 11l4 4 8-8"/><path d="M15 7h6v6"/></svg>',
        pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 0-5 5c0 3.5 5 11 5 11s5-7.5 5-11a5 5 0 0 0-5-5Z"/><circle cx="12" cy="7" r="2"/></svg>',
        logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
        lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg>',
        cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
        crossCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.7" r="0.2" fill="currentColor" stroke="currentColor" stroke-width="1.6"/></svg>',
        hourglass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12M6 22h12"/><path d="M6 2c0 5 3 6 6 8-3 2-6 3-6 8"/><path d="M18 2c0 5-3 6-6 8 3 2 6 3 6 8"/></svg>',
        pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
        arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>',
        arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m6 13 6 6 6-6"/></svg>',
        arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
        wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.6 5.1L3 17.5V21h3.5l6.1-6.1a4 4 0 0 0 5.1-5.6l-2.8 2.8-2.5-2.5Z"/></svg>',
        mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>'
    };
    document.querySelectorAll('[data-ic]').forEach(function(el) {
        el.innerHTML = ICONS[el.dataset.ic] || '';
    });


    // ============================================================
    // CONFIGURATION
    // ============================================================
    var BACKEND_URL = 'https://blk-marketplace2-0.onrender.com';
    var STORAGE_KEY = 'blk_user_id';
    var currentUser = null;
    var currentUserId = null;
    var allProducts = [];
    var selectedCategory = 'all';
    var viewedUserId = null;
    var activeConversationId = null;
    var activeChatProduct = null;
    var isFollowing = false;

    // ============================================================
    // UTILITAIRES
    // ============================================================
    var ALERT_ICONS = { success: 'check', error: 'crossCircle', info: 'info' };
    function showAlert(message, type) {
        var box = document.getElementById('alertBox');
        var t = type || 'success';
        box.innerHTML = '<span class="alert-icon" data-ic="' + (ALERT_ICONS[t] || 'info') + '"></span><span class="alert-text"></span>';
        document.querySelectorAll('#alertBox [data-ic]').forEach(function(el) { el.innerHTML = ICONS[el.dataset.ic] || ''; });
        box.querySelector('.alert-text').textContent = message;
        box.className = 'alert alert-' + t;
        box.style.display = 'flex';
        clearTimeout(box._timeout);
        box._timeout = setTimeout(function() { box.style.display = 'none'; }, 5000);
    }

    function openModal(html) {
        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.innerHTML = '<div class="modal-box" style="max-width:400px;width:100%;background:white;border-radius:20px;padding:24px;max-height:90vh;overflow-y:auto;">' + html + '</div>';
        overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
        return overlay;
    }

    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    }

    // ============================================================
    // SPLASH
    // ============================================================
    function showSplash() {
        var splash = document.getElementById('splashScreen');
        var sound = document.getElementById('splashSound');
        splash.classList.add('active');
        splash.classList.remove('hiding');
        if (sound) { sound.volume = 0.6;
            sound.play().catch(function() { console.log('🔇 Son non disponible'); }); }
        setTimeout(function() {
            splash.classList.add('hiding');
            setTimeout(function() {
                splash.classList.remove('active');
                splash.style.display = 'none';
                document.getElementById('appContainer').classList.add('active');
                document.getElementById('tabs').classList.add('show');
                showMainApp();
            }, 600);
        }, 2500);
    }

    // ============================================================
    // AUTH
    // ============================================================
    function handleLogin(name, email) {
        console.log('🔑 handleLogin appelé avec :', name, email);
        var userId = localStorage.getItem(STORAGE_KEY);
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            localStorage.setItem(STORAGE_KEY, userId);
        }
        currentUserId = userId;
        currentUser = {
            name: name || 'Utilisateur',
            email: email || 'user@example.com',
            phone: '+242 06 XXX XXXX',
            walletBalance: 0,
            id: userId,
            isSeller: false
        };
        document.getElementById('authPage').style.display = 'none';
        showSplash();
    }

    document.getElementById('btnLogin').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ Clic sur "Continue" détecté');
        var name = document.getElementById('loginName').value.trim();
        var email = document.getElementById('loginEmail').value.trim();
        var errorDiv = document.getElementById('authError');
        if (!name || !email) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Veuillez remplir tous les champs.';
            errorDiv.classList.add('shake');
            setTimeout(function() { errorDiv.classList.remove('shake'); }, 500);
            return;
        }
        errorDiv.style.display = 'none';
        handleLogin(name, email);
    });

    document.getElementById('authForm').addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('btnLogin').click();
    });

    // ============================================================
    // MAIN APP
    // ============================================================
    function showMainApp() {
        updateProfileUI(currentUser);
        loadProducts();
        loadWallet();
        loadOrders();
        loadMessages();
        loadShopArticles();
        loadStats();
        loadFollowCounts(currentUserId);
        initTabs();
        setTimeout(function() { maybeShowTabIntro('pageHome'); }, 600);
        startStatsAutoRefresh();
    }

    function updateProfileUI(user) {
        document.getElementById('profileNameNew').textContent = user.name || 'Utilisateur';
        document.getElementById('profileEmailNew').textContent = user.email || 'email@example.com';
        document.getElementById('profilePhoneNew').textContent = user.phone || '+242 06 XXX XXXX';
        document.getElementById('profileAvatarLetter').textContent = (user.name || 'U').charAt(0).toUpperCase();
        document.getElementById('profileFlamesNew').textContent = user.flames || 0;
        document.getElementById('profileFollowersNew').textContent = user.followersCount || 0;
        document.getElementById('profileFollowingNew').textContent = user.followingCount || 0;
    }

    function animateWallet(newBalance) {
        var el = document.getElementById('walletBalanceNew');
        el.textContent = newBalance;
        el.classList.remove('updated');
        void el.offsetWidth;
        el.classList.add('updated');
    }

    // ============================================================
    // ANIMATION DE CONFIRMATION (dépôt, retrait, commande)
    // ============================================================
    function showConfirmAnimation(title, subtitle) {
        var overlay = document.getElementById('confirmAnimOverlay');
        document.getElementById('confirmAnimTitle').textContent = title || 'Confirmé !';
        document.getElementById('confirmAnimSubtitle').textContent = subtitle || '';
        overlay.classList.add('visible');
        clearTimeout(overlay._hideTimeout);
        overlay._hideTimeout = setTimeout(function() { overlay.classList.remove('visible'); }, 2200);
        overlay.onclick = function() { overlay.classList.remove('visible'); };
    }

    // ============================================================
    // EXPLICATIONS "PREMIÈRE FOIS" PAR ONGLET
    // ============================================================
    var TAB_INTROS = {
        pageHome: { title: 'Accueil', text: "Parcours les articles publiés et utilise la recherche pour trouver ce que tu veux." },
        pageShop: { title: 'Mon Magasin', text: "Publie tes articles et suis tes ventes, ton chiffre d'affaires et tes stats en temps réel." },
        pageMessages: { title: 'Messagerie', text: "Échange directement avec les vendeurs et tes acheteurs." },
        pageOrders: { title: 'Mes Commandes', text: "Retrouve ici toutes tes commandes et leur statut de livraison." },
        pageProfile: { title: 'Mon Profil', text: "Gère ton wallet, tes abonnés et tes informations personnelles." }
    };
    function maybeShowTabIntro(pageId) {
        var info = TAB_INTROS[pageId];
        if (!info) return;
        var key = 'blk_intro_seen_' + pageId;
        if (localStorage.getItem(key)) return;
        localStorage.setItem(key, '1');
        var toast = document.getElementById('tabIntroToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'tabIntroToast';
            toast.className = 'tab-intro-toast';
            document.body.appendChild(toast);
            toast.addEventListener('click', function() { toast.classList.remove('visible'); });
        }
        clearTimeout(toast._hideTimeout);
        toast.classList.remove('visible');
        toast.innerHTML = '<div class="tab-intro-title">' + info.title + '</div><div>' + info.text + '</div>';
        requestAnimationFrame(function() { requestAnimationFrame(function() { toast.classList.add('visible'); }); });
        toast._hideTimeout = setTimeout(function() { toast.classList.remove('visible'); }, 5000);
    }


    var TAB_ICONS = {
        home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-6h4v6"/></svg>',
        shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V5h16v4"/><path d="M3 9l1.5-4.5h15L21 9"/><path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/><path d="M5 9v11h14V9"/><path d="M10 20v-6h4v6"/></svg>',
        messages: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4V5Z"/><circle cx="9" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="10.5" r="1" fill="currentColor" stroke="none"/></svg>',
        orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="m8.5 11 1.5 1.5L12.5 10"/><path d="M9 16h6"/></svg>',
        profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4.5-6 7-6s6 2 7 6"/></svg>'
    };

    // Icônes SVG génériques utilisées partout à la place des emojis
    function initTabs() {
        var tabs = document.querySelectorAll('.tab-item');
        var bubble = document.getElementById('tabBubble');
        var bubbleIcon = document.getElementById('tabBubbleIcon');

        tabs.forEach(function(tab) {
            var iconSpan = tab.querySelector('.tab-icon-svg');
            if (iconSpan) iconSpan.innerHTML = TAB_ICONS[tab.dataset.icon] || '';
        });

        function moveBubble(activeTab) {
            var tabRect = activeTab.getBoundingClientRect();
            var sliderRect = activeTab.parentElement.getBoundingClientRect();
            var tabCenter = (tabRect.left - sliderRect.left) + (tabRect.width / 2);
            var offsetX = tabCenter - 26; // 26 = moitié de la largeur de la bulle (52px)
            bubble.style.transform = 'translateX(' + offsetX + 'px)';
            bubbleIcon.innerHTML = TAB_ICONS[activeTab.dataset.icon] || '';
        }

        function setActiveTab(tab) {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');
            moveBubble(tab);
            var pageId = tab.dataset.tab;
            document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
            var targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                if (pageId === 'pageOrders') loadOrders();
                if (pageId === 'pageMessages') loadMessages();
                if (pageId === 'pageShop') { loadShopArticles();
                    loadStats(); }
                if (pageId === 'pageProfile') loadFollowCounts(currentUserId);
                maybeShowTabIntro(pageId);
            }
        }

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                setActiveTab(this);
            });
        });

        var activeTab = document.querySelector('.tab-item.active') || tabs[0];
        if (activeTab) {
            activeTab.classList.add('active');
            requestAnimationFrame(function() { moveBubble(activeTab); });
        }

        var resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                var currentActive = document.querySelector('.tab-item.active');
                if (currentActive) moveBubble(currentActive);
            }, 200);
        });
    }

    // ============================================================
    // FOLLOW (stats du profil)
    // ============================================================
    function loadFollowCounts(userId) {
        if (!userId) return;
        fetch(BACKEND_URL + '/api/users/' + userId)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    var followers = data.data.followersCount || 0;
                    var following = data.data.followingCount || 0;
                    document.getElementById('profileFollowersNew').textContent = followers;
                    document.getElementById('profileFollowingNew').textContent = following;
                }
            })
            .catch(function(e) { console.error(e); });
    }

    // ============================================================
    // ARTICLES (chargement et affichage)
    // ============================================================
    function loadProducts() {
        fetch(BACKEND_URL + '/api/articles')
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success && data.data) { allProducts = data.data;
                    renderProducts(allProducts); } else { allProducts = [];
                    renderProducts([]); }
            })
            .catch(function() { allProducts = [];
                renderProducts([]); });
    }

    function renderProducts(products) {
        var grid = document.getElementById('productsGrid');
        var empty = document.getElementById('emptyHome');
        var filtered = products || [];
        if (selectedCategory !== 'all') filtered = filtered.filter(function(p) { return p.category === selectedCategory; });
        var q = document.getElementById('searchInput').value.toLowerCase();
        if (q) filtered = filtered.filter(function(p) { return p.title && p.title.toLowerCase().includes(q); });

        grid.innerHTML = '';

        if (filtered.length === 0) {
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';
        filtered.forEach(function(p) {
            var card = document.createElement('div');
            card.className = 'article-card';
            card.innerHTML = '<img src="' + (p.image || 'https://via.placeholder.com/400x400/F5F0E8/CCCCCC?text=BLK') + '" />';
            card.addEventListener('click', function() { showProductModal(p); });
            grid.appendChild(card);
        });
    }

    document.getElementById('searchInput').addEventListener('input', function() { renderProducts(allProducts); });
    document.querySelectorAll('#categoryFilters .btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#categoryFilters .btn').forEach(function(b) { b.className = 'btn btn-sm btn-outline'; });
            this.className = 'btn btn-sm btn-primary';
            selectedCategory = this.dataset.cat;
            renderProducts(allProducts);
        });
    });

    // ============================================================
    // MODAL
    // ============================================================
    function showProductModal(product) {
        var modal = document.getElementById('articleModal');

        // Galerie photo réelle (plusieurs images si l'article en a, sinon fallback sur l'image unique)
        var images = (Array.isArray(product.images) && product.images.length > 0) ? product.images : [product.image].filter(Boolean);
        if (images.length === 0) images = ['https://via.placeholder.com/400x300/F5F0E8/CCCCCC?text=BLK'];
        var galleryEl = document.getElementById('modalGallery');
        var dotsEl = document.getElementById('modalGalleryDots');
        galleryEl.innerHTML = images.map(function(url) { return '<img src="' + url + '">'; }).join('');
        dotsEl.innerHTML = images.length > 1 ? images.map(function(_, i) { return '<span' + (i === 0 ? ' class="active"' : '') + '></span>'; }).join('') : '';
        galleryEl.onscroll = function() {
            var idx = Math.round(galleryEl.scrollLeft / galleryEl.clientWidth);
            dotsEl.querySelectorAll('span').forEach(function(d, i) { d.classList.toggle('active', i === idx); });
        };

        document.getElementById('modalTitle').textContent = product.title || 'Sans titre';
        document.getElementById('modalPrice').textContent = (product.price || 0) + ' FCFA';

        // Infos vendeur réelles (avatar, nom, flammes, nombre d'articles)
        document.getElementById('modalSellerName').textContent = product.sellerName || 'Vendeur';
        document.getElementById('modalFlames').textContent = 0;
        document.getElementById('modalArticles').textContent = 0;
        var avatarImg = document.getElementById('modalSellerAvatar');
        var avatarInitial = document.getElementById('modalSellerInitial');
        avatarImg.style.display = 'none';
        avatarInitial.textContent = (product.sellerName || 'V').charAt(0).toUpperCase();
        avatarInitial.style.display = 'block';

        fetch(BACKEND_URL + '/api/users/' + product.sellerId)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    document.getElementById('modalFlames').textContent = data.data.flames || 0;
                    document.getElementById('modalArticles').textContent = data.data.articlesCount || 0;
                    document.getElementById('modalSellerName').textContent = data.data.name || product.sellerName || 'Vendeur';
                    if (data.data.photo) {
                        avatarImg.src = data.data.photo;
                        avatarImg.style.display = 'block';
                        avatarInitial.style.display = 'none';
                    }
                }
            })
            .catch(function(e) { console.error(e); });
        document.getElementById('modalBuyBtn').onclick = function() {
            buyProduct(product.id, product.price, product.sellerId);
            modal.classList.remove('active');
        };
        document.getElementById('modalChatBtn').onclick = function() {
            modal.classList.remove('active');
            if (product.sellerId === currentUserId) { showAlert("C'est ton propre article.", 'info'); return; }
            var messagesTab = document.querySelector('.tab-item[data-tab="pageMessages"]');
            if (messagesTab) messagesTab.click();
            activeConversationId = product.sellerId;
            activeChatProduct = product;
            openDiscussion(product.sellerId, product.sellerName || 'Vendeur');
        };
        modal.classList.add('active');
    }

    document.getElementById('modalClose').addEventListener('click', function() { document.getElementById('articleModal').classList.remove('active'); });
    document.getElementById('articleModal').addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });

    // ============================================================
    // BUY
    // ============================================================
    function buyProduct(articleId, price, sellerId) {
        if (!currentUserId) { showAlert('Connecte-toi d\'abord', 'error'); return; }
        showAlert('Création de la commande...', 'info');
        fetch(BACKEND_URL + '/api/orders/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ articleId: articleId, buyerId: currentUserId, sellerId: sellerId, amount: price,
                buyerPhone: currentUser.phone || '065918166' })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success) { showAlert('Commande créée !', 'success');
                loadWallet();
                loadOrders();
                loadProducts(); } else { showAlert(data.message, 'error'); }
        })
        .catch(function(e) { showAlert('Erreur: ' + e.message, 'error'); });
    }

    // ============================================================
    // WALLET
    // ============================================================
    function loadWallet() {
        if (!currentUserId) return;
        fetch(BACKEND_URL + '/api/wallet/' + currentUserId)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var balance = data.balance || 0;
                document.getElementById('walletBalanceNew').textContent = balance;
                if (currentUser) {
                    if (currentUser.walletBalance !== balance) animateWallet(balance);
                    currentUser.walletBalance = balance;
                }
            })
            .catch(function(e) { console.error(e); });
    }

    document.getElementById('btnDepositNew').addEventListener('click', function() { openMoneyForm('deposit'); });
    document.getElementById('btnWithdrawNew').addEventListener('click', function() { openMoneyForm('withdraw'); });
    document.getElementById('btnTransferNew').addEventListener('click', function() { openTransferForm(); });

    function openTransferForm() {
        var html = '<div style="text-align:center;">' +
            '<h3 style="margin-bottom:4px;">Transférer à un autre utilisateur BLK</h3>' +
            '<p style="color:#999;font-size:13px;margin-bottom:16px;">Instantané, directement depuis ton wallet BLK — aucun frais Mobile Money.</p>' +
            '</div>';
        html += '<input type="tel" id="transferPhone" placeholder="Numéro du destinataire" style="width:100%;padding:12px;margin-bottom:8px;border:1px solid #ddd;border-radius:10px;font-size:16px;">';
        html += '<input type="number" id="transferAmount" placeholder="Montant (FCFA)" style="width:100%;padding:12px;margin-bottom:14px;border:1px solid #ddd;border-radius:10px;font-size:16px;">';
        html += '<button class="btn btn-primary" id="transferSubmit">Envoyer</button>';
        html += '<button class="btn btn-outline" id="transferCancel" style="margin-top:8px;">Annuler</button>';
        html += '<div id="transferStatus" style="margin-top:12px;font-size:13px;color:#999;text-align:center;"></div>';

        var overlay = openModal(html);
        overlay.querySelector('#transferCancel').addEventListener('click', function() { overlay.remove(); });
        overlay.querySelector('#transferSubmit').addEventListener('click', function() {
            var toPhone = overlay.querySelector('#transferPhone').value.trim();
            var amount = overlay.querySelector('#transferAmount').value;
            var statusEl = overlay.querySelector('#transferStatus');
            if (!toPhone || !amount || parseInt(amount) <= 0) {
                statusEl.style.color = '#E74C3C';
                statusEl.textContent = 'Renseigne un numéro et un montant valides.';
                return;
            }
            this.disabled = true;
            var submitBtn = this;
            statusEl.style.color = '#999';
            statusEl.textContent = 'Envoi en cours...';
            fetch(BACKEND_URL + '/api/wallet/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromUserId: currentUserId, toPhone: toPhone, amount: parseInt(amount) })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                submitBtn.disabled = false;
                if (data.success) {
                    statusEl.style.color = '#27ae60';
                    statusEl.textContent = data.message;
                    loadWallet();
                    setTimeout(function() { overlay.remove(); }, 1500);
                } else {
                    statusEl.style.color = '#E74C3C';
                    statusEl.textContent = data.message || 'Le transfert a échoué.';
                }
            })
            .catch(function(e) {
                submitBtn.disabled = false;
                statusEl.style.color = '#E74C3C';
                statusEl.textContent = 'Erreur: ' + e.message;
            });
        });
    }

    var WALLET_ICON_DATA_URI = 'data:image/jpeg;base64,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';

    function openMoneyForm(kind) {
        // kind: 'deposit' ou 'withdraw'
        var isDeposit = kind === 'deposit';
        var html = '<div style="text-align:center;">' +
            '<img src="' + WALLET_ICON_DATA_URI + '" alt="Wallet" style="width:140px;height:auto;margin:0 auto 12px;display:block;">' +
            '<h3 style="margin-bottom:4px;">' + (isDeposit ? 'Déposer sur ton wallet' : 'Retirer de ton wallet') + '</h3>' +
            '<p style="color:#999;font-size:13px;margin-bottom:16px;">' + (isDeposit ? "Yabetoo t'enverra une demande de confirmation par SMS/USSD sur ce numéro." : "Le montant sera envoyé sur ce numéro Mobile Money.") + '</p>' +
            '</div>';
        html += '<div style="display:flex;gap:10px;margin-bottom:10px;">' +
            '<button type="button" class="btn btn-sm money-op-btn active" data-op="mtn" style="flex:1;">MTN</button>' +
            '<button type="button" class="btn btn-sm btn-outline money-op-btn" data-op="airtel" style="flex:1;">Airtel</button>' +
            '</div>';
        html += '<input type="tel" id="moneyPhone" placeholder="Numéro (ex: 065918166)" value="' + ((currentUser && currentUser.phone) || '') + '" style="width:100%;padding:12px;margin-bottom:8px;border:1px solid #ddd;border-radius:10px;font-size:16px;">';
        html += '<input type="number" id="moneyAmount" placeholder="Montant (FCFA)" style="width:100%;padding:12px;margin-bottom:14px;border:1px solid #ddd;border-radius:10px;font-size:16px;">';
        html += '<button class="btn btn-primary" id="moneySubmit">' + (isDeposit ? 'Confirmer le dépôt' : 'Confirmer le retrait') + '</button>';
        html += '<button class="btn btn-outline" id="moneyCancel" style="margin-top:8px;">Annuler</button>';
        html += '<div id="moneyStatus" style="margin-top:12px;font-size:13px;color:#999;text-align:center;"></div>';

        var overlay = openModal(html);
        var selectedOp = 'mtn';
        overlay.querySelectorAll('.money-op-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                overlay.querySelectorAll('.money-op-btn').forEach(function(b) { b.className = 'btn btn-sm btn-outline money-op-btn'; });
                this.className = 'btn btn-sm money-op-btn active';
                selectedOp = this.dataset.op;
            });
        });
        overlay.querySelector('#moneyCancel').addEventListener('click', function() { overlay.remove(); });

        overlay.querySelector('#moneySubmit').addEventListener('click', function() {
            var phone = overlay.querySelector('#moneyPhone').value.trim();
            var amount = overlay.querySelector('#moneyAmount').value;
            var statusEl = overlay.querySelector('#moneyStatus');
            if (!phone || !amount || parseInt(amount) <= 0) {
                statusEl.textContent = 'Renseigne un numéro et un montant valides.';
                statusEl.style.color = '#E74C3C';
                return;
            }
            this.disabled = true;
            var submitBtn = this;

            if (isDeposit) {
                statusEl.style.color = '#999';
                statusEl.textContent = 'Envoi de la demande à Yabetoo...';
                fetch(BACKEND_URL + '/api/payment/initiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUserId, amount: parseInt(amount), phone: phone, operator: selectedOp })
                })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    submitBtn.disabled = false;
                    if (data.success) {
                        if (data.status === 'succeeded') {
                            statusEl.style.color = '#27ae60';
                            statusEl.textContent = 'Dépôt confirmé immédiatement !';
                            loadWallet();
                            showConfirmAnimation('Dépôt confirmé !', amount + ' FCFA crédités sur ton wallet');
                            setTimeout(function() { overlay.remove(); }, 1500);
                        } else {
                            statusEl.style.color = '#27ae60';
                            statusEl.textContent = 'Confirme le code PIN reçu par SMS/USSD sur ton téléphone. En attente de la confirmation Yabetoo...';
                            var balanceBefore = (currentUser && currentUser.walletBalance) || 0;
                            var attempts = 0;
                            var poll = setInterval(function() {
                                attempts++;
                                fetch(BACKEND_URL + '/api/wallet/' + currentUserId)
                                    .then(function(r) { return r.json(); })
                                    .then(function(w) {
                                        if ((w.balance || 0) > balanceBefore) {
                                            clearInterval(poll);
                                            loadWallet();
                                            statusEl.style.color = '#27ae60';
                                            statusEl.textContent = 'Dépôt confirmé, wallet crédité !';
                                            showConfirmAnimation('Dépôt confirmé !', amount + ' FCFA crédités sur ton wallet');
                                            setTimeout(function() { overlay.remove(); }, 1500);
                                        } else if (attempts >= 20) {
                                            clearInterval(poll);
                                            statusEl.style.color = '#999';
                                            statusEl.textContent = "Toujours en attente. Confirme bien le code PIN sur ton téléphone, ou vérifie plus tard dans l'onglet Profil.";
                                        }
                                    })
                                    .catch(function() {});
                            }, 4000);
                        }
                    } else {
                        statusEl.style.color = '#E74C3C';
                        var errDetail = data.yabetoo_error && (data.yabetoo_error.message || JSON.stringify(data.yabetoo_error));
                        statusEl.textContent = (data.message || 'Le dépôt a échoué.') + (errDetail ? ' — ' + errDetail : '');
                    }
                })
                .catch(function(e) {
                    submitBtn.disabled = false;
                    statusEl.style.color = '#E74C3C';
                    statusEl.textContent = 'Erreur: ' + e.message;
                    console.error('Erreur deposit:', e);
                });
            } else {
                statusEl.style.color = '#999';
                statusEl.textContent = 'Traitement du retrait...';
                fetch(BACKEND_URL + '/api/wallet/withdraw', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUserId, amount: parseInt(amount), phone: phone, operator: selectedOp })
                })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    submitBtn.disabled = false;
                    if (data.success) {
                        statusEl.style.color = '#27ae60';
                        statusEl.textContent = data.message || 'Retrait effectué.';
                        loadWallet();
                        showConfirmAnimation('Retrait initié !', amount + " FCFA seront envoyés sous 24h");
                        setTimeout(function() { overlay.remove(); }, 1500);
                    } else {
                        statusEl.style.color = '#E74C3C';
                        statusEl.textContent = data.message || 'Le retrait a échoué.';
                    }
                })
                .catch(function(e) {
                    submitBtn.disabled = false;
                    statusEl.style.color = '#E74C3C';
                    statusEl.textContent = 'Erreur: ' + e.message;
                    console.error('Erreur withdraw:', e);
                });
            }
        });
    }

    // ============================================================
    // STATS
    // ============================================================
    function loadStats() {
        if (!currentUserId) return;
        fetch(BACKEND_URL + '/api/stats/' + currentUserId)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    var stats = data.data;
                    document.getElementById('statTotalSales').textContent = stats.totalSales || 0;
                    document.getElementById('statTotalArticles').textContent = stats.totalArticles || 0;
                    document.getElementById('statTotalRevenue').textContent = formatNumber(stats.totalRevenue || 0);
                    document.getElementById('statTotalOrders').textContent = stats.totalPurchases || 0;
                    renderShopChart(stats.history || [], stats.totalSales || 0, stats.totalRevenue || 0);
                    renderWalletChart(stats.history || []);
                }
            })
            .catch(function(e) { console.error(e); });
    }

    // Mini-graphique "temps réel" de la carte Wallet (sans chiffres affichés dessus, juste la courbe)
    function renderWalletChart(history) {
        var wrap = document.getElementById('walletChartWrap');
        var badge = document.getElementById('walletDeltaBadge');
        if (!wrap) return;
        if (!history || history.length === 0) {
            wrap.innerHTML = '';
            badge.style.display = 'none';
            return;
        }
        var data = history.slice(-8);
        var vals = data.map(function(h) { return h.revenu || 0; });
        var n = vals.length;
        var W = wrap.clientWidth || 280, H = 60, pad = 4;
        var maxVal = Math.max.apply(null, vals.concat([1]));
        function xAt(i) { return n > 1 ? pad + (i / (n - 1)) * (W - pad * 2) : W / 2; }
        function yAt(v) { return pad + (H - pad * 2) - (v / maxVal) * (H - pad * 2); }
        var linePath = vals.map(function(v, i) { return (i === 0 ? 'M' : 'L') + xAt(i).toFixed(1) + ',' + yAt(v).toFixed(1); }).join(' ');
        var areaPath = linePath + ' L' + xAt(n - 1).toFixed(1) + ',' + H + ' L' + xAt(0).toFixed(1) + ',' + H + ' Z';
        var dots = vals.map(function(v, i) {
            return '<circle cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(v).toFixed(1) + '" r="2.2" fill="#FFD700"/>';
        }).join('');
        wrap.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
            '<defs><linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#FFD700" stop-opacity="0.35"/>' +
            '<stop offset="100%" stop-color="#FFD700" stop-opacity="0"/></linearGradient></defs>' +
            '<path d="' + areaPath + '" fill="url(#walletGrad)" stroke="none"/>' +
            '<path d="' + linePath + '" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            dots + '</svg>';

        if (n >= 2 && vals[n - 2] > 0) {
            var pct = Math.round(((vals[n - 1] - vals[n - 2]) / vals[n - 2]) * 100);
            badge.style.display = 'inline-block';
            badge.innerHTML = '<span class="icon-inline">' + (pct >= 0 ? ICONS.arrowUp : ICONS.arrowDown) + '</span>' + (pct >= 0 ? ' +' : ' ') + pct + '%';
            badge.className = 'wallet-delta-badge ' + (pct >= 0 ? 'up' : 'down');
        } else {
            badge.style.display = 'none';
        }
    }

    // Graphique interactif temps réel : Ventes (bleu) vs Revenu (rouge), avec survol type "tooltip"
    function renderShopChart(history, totalSales, totalRevenue) {
        var wrap = document.getElementById('chartSvgWrap');
        var empty = document.getElementById('statsEmpty');
        document.getElementById('chartVentesTotal').textContent = totalSales;
        document.getElementById('chartRevenuTotal').textContent = formatNumber(totalRevenue) + ' FCFA';

        if (!history || history.length === 0) {
            wrap.innerHTML = '';
            empty.style.display = 'block';
            document.getElementById('chartVentesDelta').textContent = '';
            document.getElementById('chartRevenuDelta').textContent = '';
            return;
        }
        empty.style.display = 'none';

        var data = history.slice(-8);
        // Delta = variation entre les 2 derniers mois disponibles
        function setDelta(elId, arr, key) {
            var el = document.getElementById(elId);
            if (arr.length < 2) { el.textContent = ''; return; }
            var prev = arr[arr.length - 2][key] || 0;
            var curr = arr[arr.length - 1][key] || 0;
            if (prev === 0) { el.textContent = ''; return; }
            var pct = Math.round(((curr - prev) / prev) * 100);
            el.innerHTML = '<span class="icon-inline">' + (pct >= 0 ? ICONS.arrowUp : ICONS.arrowDown) + '</span>' + (pct >= 0 ? ' +' : ' ') + pct + '%';
            el.className = 'legend-delta ' + (pct >= 0 ? 'up' : 'down');
        }
        setDelta('chartVentesDelta', data, 'ventes');
        setDelta('chartRevenuDelta', data, 'revenu');

        var W = wrap.clientWidth || 320, H = 160, padL = 8, padR = 8, padT = 14, padB = 22;
        var innerW = W - padL - padR, innerH = H - padT - padB;
        var ventesVals = data.map(function(h) { return h.ventes || 0; });
        var revenuKVals = data.map(function(h) { return (h.revenu || 0) / 1000; }); // en k FCFA pour partager l'échelle
        var maxVal = Math.max.apply(null, ventesVals.concat(revenuKVals).concat([1]));
        var n = data.length;
        function xAt(i) { return n > 1 ? padL + (i / (n - 1)) * innerW : padL + innerW / 2; }
        function yAt(v) { return padT + innerH - (v / maxVal) * innerH; }

        function pathFor(vals) {
            return vals.map(function(v, i) { return (i === 0 ? 'M' : 'L') + xAt(i).toFixed(1) + ',' + yAt(v).toFixed(1); }).join(' ');
        }
        function areaFor(vals) {
            var top = pathFor(vals);
            return top + ' L' + xAt(n - 1).toFixed(1) + ',' + (padT + innerH) + ' L' + xAt(0).toFixed(1) + ',' + (padT + innerH) + ' Z';
        }

        var gridLines = '';
        for (var g = 0; g <= 3; g++) {
            var gy = padT + (innerH / 3) * g;
            gridLines += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>';
        }

        var labels = '';
        data.forEach(function(h, i) {
            if (n <= 6 || i % Math.ceil(n / 6) === 0 || i === n - 1) {
                labels += '<text x="' + xAt(i).toFixed(1) + '" y="' + (H - 4) + '" font-size="10" fill="#999" text-anchor="middle">' + (h.month || '') + '</text>';
            }
        });

        var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
            gridLines +
            '<path d="' + areaFor(revenuKVals) + '" fill="rgba(231,76,60,0.10)" stroke="none"/>' +
            '<path d="' + areaFor(ventesVals) + '" fill="rgba(59,130,246,0.12)" stroke="none"/>' +
            '<path d="' + pathFor(revenuKVals) + '" fill="none" stroke="#E74C3C" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<path d="' + pathFor(ventesVals) + '" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
            labels +
            '<line id="chartCursorLine" x1="0" y1="' + padT + '" x2="0" y2="' + (padT + innerH) + '" stroke="#1a1a1a" stroke-width="1" stroke-dasharray="3,3" opacity="0"/>' +
            '<circle id="chartCursorVentes" r="4" fill="#3B82F6" stroke="#fff" stroke-width="2" opacity="0"/>' +
            '<circle id="chartCursorRevenu" r="4" fill="#E74C3C" stroke="#fff" stroke-width="2" opacity="0"/>' +
            '</svg><div class="chart-tooltip" id="chartTooltip"></div>';

        wrap.innerHTML = svg;

        var svgEl = wrap.querySelector('svg');
        var tooltip = document.getElementById('chartTooltip');
        var cursorLine = document.getElementById('chartCursorLine');
        var cursorVentes = document.getElementById('chartCursorVentes');
        var cursorRevenu = document.getElementById('chartCursorRevenu');

        function showAt(i) {
            var h = data[i];
            var x = xAt(i);
            cursorLine.setAttribute('x1', x); cursorLine.setAttribute('x2', x); cursorLine.setAttribute('opacity', 1);
            cursorVentes.setAttribute('cx', x); cursorVentes.setAttribute('cy', yAt(ventesVals[i])); cursorVentes.setAttribute('opacity', 1);
            cursorRevenu.setAttribute('cx', x); cursorRevenu.setAttribute('cy', yAt(revenuKVals[i])); cursorRevenu.setAttribute('opacity', 1);
            var pct = (x / W) * 100;
            tooltip.style.left = pct + '%';
            tooltip.innerHTML = '<div class="tt-date">' + (h.month || '') + '</div>' +
                '<div class="tt-row"><span class="tt-dot" style="background:#3B82F6;"></span>' + (h.ventes || 0) + ' ventes</div>' +
                '<div class="tt-row"><span class="tt-dot" style="background:#E74C3C;"></span>' + formatNumber(h.revenu || 0) + ' FCFA</div>';
            tooltip.classList.add('visible');
        }
        function hideCursor() {
            cursorLine.setAttribute('opacity', 0);
            cursorVentes.setAttribute('opacity', 0);
            cursorRevenu.setAttribute('opacity', 0);
            tooltip.classList.remove('visible');
        }
        function handlePointer(clientX) {
            var rect = svgEl.getBoundingClientRect();
            var relX = ((clientX - rect.left) / rect.width) * W;
            var idx = n > 1 ? Math.round(((relX - padL) / innerW) * (n - 1)) : 0;
            if (idx < 0) idx = 0; if (idx > n - 1) idx = n - 1;
            showAt(idx);
        }
        svgEl.addEventListener('mousemove', function(e) { handlePointer(e.clientX); });
        svgEl.addEventListener('mouseleave', hideCursor);
        svgEl.addEventListener('touchstart', function(e) { handlePointer(e.touches[0].clientX); }, { passive: true });
        svgEl.addEventListener('touchmove', function(e) { handlePointer(e.touches[0].clientX); }, { passive: true });
        svgEl.addEventListener('touchend', hideCursor);
        // Affiche le dernier point par défaut
        showAt(n - 1);
    }

    // Rafraîchissement "temps réel" des stats pendant que l'onglet Mon Magasin est ouvert
    var statsRefreshInterval = null;
    function startStatsAutoRefresh() {
        stopStatsAutoRefresh();
        statsRefreshInterval = setInterval(function() {
            var shopActive = document.getElementById('pageShop').classList.contains('active');
            var profileActive = document.getElementById('pageProfile').classList.contains('active');
            if (shopActive || profileActive) loadStats();
        }, 15000);
    }
    function stopStatsAutoRefresh() {
        if (statsRefreshInterval) { clearInterval(statsRefreshInterval); statsRefreshInterval = null; }
    }

    // ============================================================
    // ORDRES
    // ============================================================
    function parseServerDate(val) {
        if (!val) return null;
        if (val._seconds) return new Date(val._seconds * 1000);
        if (val.seconds) return new Date(val.seconds * 1000);
        var d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
    }

    setInterval(function() {
        document.querySelectorAll('.order-countdown').forEach(function(el) {
            var expires = parseServerDate(el.dataset.expires);
            if (!expires) { el.textContent = ''; return; }
            var diff = expires.getTime() - Date.now();
            if (diff <= 0) { el.textContent = 'Délai expiré'; return; }
            var h = Math.floor(diff / 3600000);
            var m = Math.floor((diff % 3600000) / 60000);
            var s = Math.floor((diff % 60000) / 1000);
            el.textContent = 'Livraison sous ' + h + 'h ' + (m < 10 ? '0' : '') + m + 'm ' + (s < 10 ? '0' : '') + s + 's';
        });
    }, 1000);

    function loadOrders() {
        if (!currentUserId) return;
        fetch(BACKEND_URL + '/api/orders/' + currentUserId)
            .then(function(res) { return res.json(); })
            .then(function(orders) {
                var container = document.getElementById('ordersList');
                var empty = document.getElementById('emptyOrders');
                var isValid = false;
                if (orders !== null && orders !== undefined && Array.isArray(orders) && orders.length > 0) isValid = true;
                if (isValid === false) { container.innerHTML = '';
                    empty.style.display = 'block'; return; }
                empty.style.display = 'none';
                container.innerHTML = '';
                for (var i = 0; i < orders.length; i++) {
                    var order = orders[i];
                    var card = document.createElement('div');
                    card.className = 'glass';
                    card.style.marginBottom = '12px';
                    var statusText = '<span class="icon-inline">' + ICONS.hourglass + '</span> En attente';
                    if (order.status === 'livré') statusText = '<span class="icon-inline">' + ICONS.check + '</span> Livré';
                    else if (order.status === 'en attente de confirmation') statusText = '<span class="icon-inline">' + ICONS.hourglass + '</span> En attente';
                    else if (order.status) statusText = order.status;
                    var articleTitle = 'Article';
                    if (order.article && order.article.title) articleTitle = order.article.title;
                    var amount = 0;
                    if (order.totalAmount) amount = order.totalAmount;
                    else if (order.amount) amount = order.amount;
                    var countdownHtml = '';
                    if (order.status === 'en attente de confirmation' && order.expiresAt) {
                        countdownHtml = '<div class="order-countdown" data-expires="' + order.expiresAt + '" style="font-size:12px;color:#E74C3C;font-weight:700;margin-top:4px;"></div>';
                    }
                    card.innerHTML = '<div><strong>' + articleTitle + '</strong><br>' + amount + ' FCFA<br><span style="font-size:12px;color:#999;">' + statusText +
                        '</span>' + countdownHtml + '</div>';
                    if (order.status === 'en attente de confirmation' && order.buyerId === currentUserId) {
                        var confirmBtn = document.createElement('button');
                        confirmBtn.className = 'btn btn-success btn-sm';
                        confirmBtn.style.marginTop = '10px';
                        confirmBtn.style.width = 'auto';
                        confirmBtn.style.padding = '8px 16px';
                        confirmBtn.textContent = 'Confirmer réception';
                        confirmBtn.onclick = function(oid) { return function() { openOrderConfirm(oid); }; }(order.id);
                        card.appendChild(confirmBtn);
                    }
                    container.appendChild(card);
                }
            })
            .catch(function(e) { console.error('Orders error:', e);
                document.getElementById('ordersList').innerHTML = '<p class="empty">Erreur chargement</p>'; });
    }

    function openOrderConfirm(orderId) {
        var html = '<h3 style="margin-bottom:12px;">Confirmer la réception</h3>';
        html += '<label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:14px;"><input type="checkbox" id="ocRecu"> J\'ai bien reçu l\'article</label>';
        html += '<label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:14px;"><input type="checkbox" id="ocEtat"> Il est en bon état</label>';
        html += '<label style="display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:14px;"><input type="checkbox" id="ocConfirme"> Je confirme la transaction</label>';
        html += '<button class="btn btn-success" id="ocSubmit">Confirmer le paiement</button>';
        html += '<button class="btn btn-outline" id="ocCancel" style="margin-top:8px;">Annuler</button>';
        html += '<div id="ocStatus" style="margin-top:12px;font-size:13px;color:#999;text-align:center;"></div>';

        var overlay = openModal(html);
        overlay.querySelector('#ocCancel').addEventListener('click', function() { overlay.remove(); });
        overlay.querySelector('#ocSubmit').addEventListener('click', function() {
            var statusEl = overlay.querySelector('#ocStatus');
            var recu = overlay.querySelector('#ocRecu').checked;
            var bonEtat = overlay.querySelector('#ocEtat').checked;
            var confirme = overlay.querySelector('#ocConfirme').checked;
            if (!recu || !bonEtat || !confirme) {
                statusEl.style.color = '#E74C3C';
                statusEl.textContent = 'Coche les 3 cases pour confirmer.';
                return;
            }
            this.disabled = true;
            var submitBtn = this;
            statusEl.style.color = '#999';
            statusEl.textContent = 'Confirmation en cours...';
            fetch(BACKEND_URL + '/api/orders/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderId, buyerId: currentUserId, confirmations: { recu: true, bon_etat: true, confirme: true } })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                submitBtn.disabled = false;
                if (data.success) {
                    overlay.remove();
                    showConfirmAnimation('Commande confirmée !', 'Le vendeur a été crédité.');
                    loadOrders();
                } else {
                    statusEl.style.color = '#E74C3C';
                    statusEl.textContent = data.message || 'La confirmation a échoué.';
                }
            })
            .catch(function(e) {
                submitBtn.disabled = false;
                statusEl.style.color = '#E74C3C';
                statusEl.textContent = 'Erreur: ' + e.message;
            });
        });
    }

    // ============================================================
    // SHOP ARTICLES
    // ============================================================
    function loadShopArticles() {
        if (!currentUserId) return;
        fetch(BACKEND_URL + '/api/articles/seller/' + currentUserId)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var container = document.getElementById('shopArticles');
                if (!data.success || !data.data || data.data.length === 0) { container.innerHTML = '<p class="empty">Aucun article publié</p>';
                    return; }
                container.innerHTML = '';
                data.data.forEach(function(a) {
                    var div = document.createElement('div');
                    div.style.cssText =
                        'display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.5); border-radius:12px; padding:12px; margin-bottom:8px;';
                    var statusText = a.status === 'active' ? '<span class="icon-inline">' + ICONS.check + '</span> En vente' : (a.status === 'sold' ? '<span class="icon-inline">' + ICONS.check + '</span> Vendu' : '<span class="icon-inline">' + ICONS.pause + '</span> Inactif');
                    div.innerHTML = '<img src="' + (a.image ||
                        'https://via.placeholder.com/50x50/F5F0E8/CCCCCC?text=BLK') + '" style="width:50px; height:50px; object-fit:cover; border-radius:8px;" /><div style="flex:1;"><strong>' +
                        a.title + '</strong><br>' + a.price + ' FCFA<br><span style="font-size:11px; color:#999;">' + statusText +
                        '</span></div>';
                    if (a.status === 'active') {
                        var delBtn = document.createElement('button');
                        delBtn.className = 'btn btn-danger btn-sm';
                        delBtn.style.width = 'auto';
                        delBtn.style.padding = '6px 12px';
                        delBtn.textContent = 'Supprimer';
                        delBtn.onclick = function() { deleteArticle(a.id); };
                        div.appendChild(delBtn);
                    }
                    container.appendChild(div);
                });
            })
            .catch(function(e) { console.error(e); });
    }

    function deleteArticle(articleId) {
        if (!confirm('Supprimer cet article ?')) return;
        fetch(BACKEND_URL + '/api/articles/' + articleId, { method: 'DELETE' })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) { showAlert('Article supprimé !', 'success');
                    loadShopArticles();
                    loadProducts();
                    loadStats(); } else { showAlert(data.message, 'error'); }
            })
            .catch(function(e) { showAlert('Erreur: ' + e.message, 'error'); });
    }

    // ============================================================
    // PUBLIER
    // ============================================================
    document.getElementById('btnPublish').addEventListener('click', function() {
        var html = '<h3><span class="icon-inline-md">' + ICONS.send + '</span> Publier un article</h3>';
        html += '<input type="text" id="pubTitle" placeholder="Titre" style="width:100%; padding:12px; margin-bottom:8px; border:1px solid #ddd; border-radius:10px;">';
        html += '<textarea id="pubDesc" placeholder="Description" rows="3" style="width:100%; padding:12px; margin-bottom:8px; border:1px solid #ddd; border-radius:10px;"></textarea>';
        html += '<input type="number" id="pubPrice" placeholder="Prix (FCFA)" style="width:100%; padding:12px; margin-bottom:8px; border:1px solid #ddd; border-radius:10px;">';
        html += '<select id="pubCategory" style="width:100%; padding:12px; margin-bottom:8px; border:1px solid #ddd; border-radius:10px;">';
        html += '<option value="vêtements">Vêtements</option><option value="chaussures">Chaussures</option><option value="sacs">Sacs</option><option value="bijoux">Bijoux</option><option value="accessoires">Accessoires</option>';
        html += '</select>';
        html += '<button type="button" class="btn btn-outline" id="pubCameraBtn" style="margin-bottom:8px;"><span class="icon-inline" data-ic="send"></span> Prendre une photo (<span id="pubPhotoCount">0</span>/10)</button>';
        html += '<input type="file" id="pubImageCamera" accept="image/*" capture="environment" style="display:none;">';
        html += '<div id="pubThumbs" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;"></div>';
        html += '<button class="btn btn-primary" id="pubSubmit">Publier</button>';
        html += '<button class="btn btn-outline" onclick="this.parentElement.parentElement.remove()" style="margin-top:8px;">Annuler</button>';
        html += '<div id="pubStatus" style="margin-top:10px;font-size:13px;text-align:center;color:#999;"></div>';
        var overlay = openModal(html);

        var photos = []; // { file, dataUrl }
        var MAX_PHOTOS = 10;

        function renderThumbs() {
            var thumbs = overlay.querySelector('#pubThumbs');
            thumbs.innerHTML = '';
            photos.forEach(function(p, idx) {
                var wrap = document.createElement('div');
                wrap.style.cssText = 'position:relative;width:64px;height:64px;';
                wrap.innerHTML = '<img src="' + p.dataUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">' +
                    '<button type="button" data-idx="' + idx + '" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:#E74C3C;color:white;border:none;font-size:12px;line-height:1;cursor:pointer;">✕</button>';
                wrap.querySelector('button').addEventListener('click', function() {
                    photos.splice(parseInt(this.dataset.idx), 1);
                    renderThumbs();
                });
                thumbs.appendChild(wrap);
            });
            overlay.querySelector('#pubPhotoCount').textContent = photos.length;
            overlay.querySelector('#pubCameraBtn').disabled = photos.length >= MAX_PHOTOS;
        }

        overlay.querySelector('#pubCameraBtn').addEventListener('click', function() {
            if (photos.length >= MAX_PHOTOS) { showAlert('Maximum 10 photos par article.', 'error'); return; }
            overlay.querySelector('#pubImageCamera').click();
        });
        overlay.querySelector('#pubImageCamera').addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
                photos.push({ file: file, dataUrl: ev.target.result });
                renderThumbs();
            };
            reader.readAsDataURL(file);
            e.target.value = ''; // permet de reprendre une photo tout de suite après
        });

        document.getElementById('pubSubmit').addEventListener('click', function() {
            var title = document.getElementById('pubTitle').value.trim();
            var description = document.getElementById('pubDesc').value.trim();
            var price = document.getElementById('pubPrice').value;
            var category = document.getElementById('pubCategory').value;
            var statusEl = overlay.querySelector('#pubStatus');
            if (!title || !description || !price) { showAlert('Remplis tous les champs', 'error'); return; }
            if (photos.length === 0) { showAlert("Prends au moins une photo à l'appareil photo.", 'error'); return; }

            var submitBtn = this;
            submitBtn.disabled = true;

            function submitArticleWithImages(imageUrls) {
                fetch(BACKEND_URL + '/api/articles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: title, description: description, price: parseInt(price),
                        category: category, images: imageUrls, sellerId: currentUserId,
                        sellerName: currentUser.name })
                })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    submitBtn.disabled = false;
                    if (data.success) { showAlert('Article publié !', 'success');
                        overlay.remove();
                        loadShopArticles();
                        loadProducts();
                        loadStats(); } else { showAlert(data.message, 'error'); }
                })
                .catch(function(e) { submitBtn.disabled = false; showAlert('Erreur: ' + e.message, 'error'); });
            }

            var uploadedUrls = [];
            var i = 0;
            function uploadNext() {
                if (i >= photos.length) { submitArticleWithImages(uploadedUrls); return; }
                statusEl.textContent = 'Envoi de la photo ' + (i + 1) + '/' + photos.length + '...';
                fetch(BACKEND_URL + '/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ base64: photos[i].dataUrl })
                })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (data.success) {
                        uploadedUrls.push(data.url);
                        i++;
                        uploadNext();
                    } else {
                        submitBtn.disabled = false;
                        showAlert('Erreur upload photo ' + (i + 1) + ': ' + (data.message || ''), 'error');
                    }
                })
                .catch(function(e) { submitBtn.disabled = false; showAlert('Erreur upload: ' + e.message, 'error'); });
            }
            uploadNext();
        });
    });

    // ============================================================
    // MESSAGES (simplifié)
    // ============================================================
    function loadMessages() {
        if (!currentUserId) return;
        fetch(BACKEND_URL + '/api/messages/' + currentUserId)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var container = document.getElementById('contactsList');
                var empty = document.getElementById('emptyMessages');
                var view = document.getElementById('discussionView');
                if (!data.success || !data.data || data.data.length === 0) {
                    container.innerHTML = '';
                    if (activeConversationId) {
                        // Une discussion a été ouverte volontairement (ex: depuis un article) mais n'a pas encore de messages : on garde la zone de saisie visible.
                        empty.style.display = 'none';
                        if (view) view.style.display = 'block';
                        document.getElementById('messagesList').innerHTML = '<p class="empty">Aucun message pour l\'instant, écris le premier !</p>';
                    } else {
                        empty.style.display = 'block';
                        if (view) view.style.display = 'none';
                    }
                    return;
                }
                empty.style.display = 'none';
                var contacts = {};
                data.data.forEach(function(msg) {
                    var otherId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
                    var otherName = msg.senderId === currentUserId ? msg.receiverName : msg.senderName;
                    if (!contacts[otherId]) {
                        contacts[otherId] = { name: otherName || 'Utilisateur', lastMessage: msg.text || '',
                            time: msg.createdAt, unread: (msg.receiverId === currentUserId && !msg
                                .read) ? 1 : 0, photo: msg.senderId === currentUserId ? msg
                                .receiverPhoto : msg.senderPhoto };
                    } else if (msg.receiverId === currentUserId && !msg.read) { contacts[otherId].unread +=
                        1; }
                    if (new Date(msg.createdAt) > new Date(contacts[otherId].time)) { contacts[otherId]
                            .lastMessage = msg.text || '';
                        contacts[otherId].time = msg.createdAt; }
                });
                var contactKeys = Object.keys(contacts);
                container.innerHTML = contactKeys.map(function(id) {
                    var isActive = (activeConversationId === id) ? 'active' : '';
                    var unreadBadge = contacts[id].unread > 0 ? '<span style="background:#E74C3C; color:white; border-radius:50%; padding:1px 8px; font-size:10px; margin-left:4px;">' +
                        contacts[id].unread + '</span>' : '';
                    var photoHtml = contacts[id].photo ? '<img src="' + contacts[id].photo +
                        '" style="width:24px; height:24px; border-radius:50%; object-fit:cover;" />' :
                        '';
                    return '<div class="contact-chip ' + isActive + '" data-id="' + id + '">' + photoHtml +
                        contacts[id].name + unreadBadge + '</div>';
                }).join('');
                document.querySelectorAll('.contact-chip').forEach(function(el) {
                    el.addEventListener('click', function() {
                        var id = this.dataset.id;
                        activeConversationId = id;
                        activeChatProduct = null;
                        document.querySelectorAll('.contact-chip').forEach(function(c) { c.classList
                                .remove('active'); });
                        this.classList.add('active');
                        openDiscussion(id, contacts[id].name);
                    });
                });
                if (!activeConversationId && contactKeys.length > 0) { activeConversationId = contactKeys[0];
                    openDiscussion(activeConversationId, contacts[activeConversationId].name); } else if (
                    activeConversationId && contacts[activeConversationId]) { openDiscussion(
                    activeConversationId, contacts[activeConversationId].name); }
            })
            .catch(function(e) { console.error(e); });
    }

    function openDiscussion(contactId, contactName) {
        var view = document.getElementById('discussionView');
        if (!view) {
            var html = '<div id="discussionView" style="display:block;"><div class="glass"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><h3 id="discussionName">' +
                contactName +
                '</h3><button class="btn btn-sm btn-outline" id="btnCloseDiscussion" style="width:auto; padding:4px 12px;"><span class="icon-inline">' + ICONS.cross + '</span></button></div><div id="discussionProductCard" class="discussion-product-card" style="display:none;"></div><div id="messagesList" style="max-height:300px; overflow-y:auto; padding:4px 0;"></div><div style="display:flex; gap:8px; margin-top:8px;"><input type="text" id="messageInput" placeholder="Écris ton message..." style="flex:1; padding:12px; border:1px solid #ddd; border-radius:14px; font-size:16px;"><button class="btn btn-outline" id="btnRecordVoice" type="button" title="Message vocal" style="width:auto; padding:12px 14px;"></button><button class="btn btn-primary" id="btnSendMessage" style="width:auto; padding:12px 20px;">Envoyer</button></div></div></div>';
            document.getElementById('pageMessages').innerHTML += html;
            view = document.getElementById('discussionView');
        }
        view.style.display = 'block';
        document.getElementById('emptyMessages').style.display = 'none';
        document.getElementById('discussionName').textContent = contactName || 'Utilisateur';
        var micBtn = document.getElementById('btnRecordVoice');
        if (micBtn && !micBtn.innerHTML.trim()) micBtn.innerHTML = ICONS.mic;
        initVoiceButton();

        var productCard = document.getElementById('discussionProductCard');
        if (activeChatProduct && activeChatProduct.sellerId === contactId) {
            var p = activeChatProduct;
            productCard.style.display = 'flex';
            productCard.innerHTML = '<img src="' + (p.image || (p.images && p.images[0]) || '') + '">' +
                '<div class="dp-info"><div class="dp-title">' + (p.title || 'Article') + '</div><div class="dp-price">' + (p.price || 0) + ' FCFA</div></div>' +
                '<button id="discussionBuyBtn">Acheter</button>';
            document.getElementById('discussionBuyBtn').addEventListener('click', function() {
                buyProduct(p.id, p.price, p.sellerId);
            });
        } else {
            productCard.style.display = 'none';
            productCard.innerHTML = '';
        }

        loadConversation(contactId);
    }

    document.getElementById('btnCloseDiscussion').addEventListener('click', function() { document.getElementById(
            'discussionView').style.display = 'none';
        activeConversationId = null; });

    function loadConversation(contactId) {
        if (!currentUserId || !contactId) return;
        fetch(BACKEND_URL + '/api/messages/' + currentUserId)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var container = document.getElementById('messagesList');
                if (!data.success) return;
                var messages = data.data.filter(function(msg) { return (msg.senderId === currentUserId && msg
                        .receiverId === contactId) || (msg.senderId === contactId && msg.receiverId ===
                        currentUserId); });
                messages.sort(function(a, b) { return (parseServerDate(a.createdAt) || 0) - (parseServerDate(b.createdAt) || 0); });
                if (messages.length === 0) { container.innerHTML = '<p class="empty">Aucun message</p>'; return; }
                container.innerHTML = messages.map(function(msg) {
                    var isMine = msg.senderId === currentUserId;
                    var name = isMine ? 'Moi' : (msg.senderName || 'Utilisateur');
                    var senderHtml = isMine ? '' : '<div class="sender">' + name + '</div>';
                    var d = parseServerDate(msg.createdAt);
                    var timeStr = d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    var bodyHtml = msg.audioUrl
                        ? '<audio controls src="' + msg.audioUrl + '" style="max-width:200px;height:36px;"></audio>'
                        : (msg.text || '');
                    return '<div class="message-bubble ' + (isMine ? 'mine' : 'other') +
                        '"><div class="bubble">' + senderHtml + bodyHtml + '<span class="time">' +
                        timeStr + '</span></div></div>';
                }).join('');
                container.scrollTop = container.scrollHeight;
            })
            .catch(function(e) { console.error(e); });
    }

    function sendMessagePayload(payload) {
        fetch(BACKEND_URL + '/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success) { loadConversation(activeConversationId); loadMessages(); }
            else { showAlert(data.message, 'error'); }
        })
        .catch(function(e) { showAlert('Erreur: ' + e.message, 'error'); });
    }

    document.getElementById('btnSendMessage').addEventListener('click', function() {
        var text = document.getElementById('messageInput').value.trim();
        if (!text || !activeConversationId) { showAlert('Message ou destinataire manquant', 'error'); return; }
        document.getElementById('messageInput').value = '';
        sendMessagePayload({ senderId: currentUserId, receiverId: activeConversationId, text: text, senderName: currentUser.name });
    });

    document.getElementById('messageInput').addEventListener('keypress', function(e) { if (e.key === 'Enter') document
            .getElementById('btnSendMessage').click(); });

    // ============================================================
    // MESSAGE VOCAL (façon WhatsApp) — uniquement vers le vendeur/contact actif
    // ============================================================
    var mediaRecorder = null;
    var audioChunks = [];
    var recordStartTime = 0;

    function initVoiceButton() {
        var btn = document.getElementById('btnRecordVoice');
        if (!btn || btn._voiceBound) return;
        btn._voiceBound = true;
        btn.addEventListener('click', function() {
            if (!activeConversationId) { showAlert('Ouvre une discussion avant d\'envoyer un vocal', 'error'); return; }
            if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                startRecording(btn);
            } else {
                stopRecording(btn);
            }
        });
    }

    function startRecording(btn) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
            audioChunks = [];
            recordStartTime = Date.now();
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(e) { audioChunks.push(e.data); };
            mediaRecorder.onstop = function() {
                stream.getTracks().forEach(function(t) { t.stop(); });
                var duration = Math.round((Date.now() - recordStartTime) / 1000);
                var blob = new Blob(audioChunks, { type: 'audio/webm' });
                var reader = new FileReader();
                reader.onload = function(e) {
                    sendMessagePayload({
                        senderId: currentUserId, receiverId: activeConversationId,
                        senderName: currentUser.name, audioUrl: e.target.result, audioDuration: duration
                    });
                };
                reader.readAsDataURL(blob);
            };
            mediaRecorder.start();
            btn.classList.add('recording');
            btn.title = 'Arrêter et envoyer';
        }).catch(function() {
            showAlert("Impossible d'accéder au micro. Vérifie les autorisations.", 'error');
        });
    }

    function stopRecording(btn) {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
        btn.classList.remove('recording');
        btn.title = 'Message vocal';
    }

    // ============================================================
    // LOGOUT
    // ============================================================
    document.getElementById('btnLogout').addEventListener('click', function() {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    // ============================================================
    // ADMIN
    // ============================================================
    if (window.location.hash === '#admin') {
        document.getElementById('authPage').style.display = 'none';
        document.getElementById('appContainer').classList.add('active');
        document.getElementById('tabs').classList.add('show');
        document.getElementById('tabs').style.display = 'none';
        var adminHtml =
            '<div style="max-width:500px; margin:40px auto; background:white; padding:24px; border-radius:20px;"><h2 style="color:#E74C3C;"><span class="icon-inline-md">' + ICONS.lock + '</span> Admin BLK</h2><p>Créditer un wallet après réception du virement.</p><div id="adminLogin"><input type="password" id="adminPassword" placeholder="Mot de passe" style="width:100%; padding:12px; margin:8px 0; border:1px solid #ddd; border-radius:10px;"><button class="btn btn-primary" id="btnAdminLogin">Accéder</button></div><div id="adminPanel" style="display:none; margin-top:16px;"><input type="text" id="adminUserId" placeholder="ID utilisateur (ex: user_...)" style="width:100%; padding:12px; margin:8px 0; border:1px solid #ddd; border-radius:10px;"><input type="number" id="adminAmount" placeholder="Montant (FCFA)" style="width:100%; padding:12px; margin:8px 0; border:1px solid #ddd; border-radius:10px;"><button class="btn btn-success" id="btnAdminCredit"><span class="icon-inline">' + ICONS.coin + '</span> Créditer</button><div id="adminResult"></div></div></div>';
        document.getElementById('appContainer').innerHTML = adminHtml;
        document.getElementById('btnAdminLogin').addEventListener('click', function() {
            var pwd = document.getElementById('adminPassword').value;
            if (pwd === 'BLK2026') { document.getElementById('adminLogin').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                showAlert('Accès accordé', 'success'); } else { showAlert('Mot de passe incorrect',
                'error'); }
        });
        document.getElementById('btnAdminCredit').addEventListener('click', function() {
            var userId = document.getElementById('adminUserId').value.trim();
            var amount = parseInt(document.getElementById('adminAmount').value);
            if (!userId || !amount) { showAlert('User ID et montant requis', 'error'); return; }
            fetch(BACKEND_URL + '/api/wallet/admin-credit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, amount: amount, phone: '065918166' })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) { showAlert('Wallet crédité de ' + amount + ' FCFA', 'success');
                    document.getElementById('adminUserId').value = '';
                    document.getElementById('adminAmount').value = ''; } else { showAlert('Erreur: ' +
                        data.message, 'error'); }
            })
            .catch(function(e) { showAlert('Erreur: ' + e.message, 'error'); });
        });
    }

    console.log('✅ BLK Marketplace - Version corrigée');
    console.log('🔗 Backend URL:', BACKEND_URL);
</script>
</body>
</html>

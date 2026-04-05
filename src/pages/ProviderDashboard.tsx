import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AddService from "../components/AddService";
import { useAuth } from "../context/AuthContext";
import {
  Briefcase, CalendarDays, Star, TrendingUp, Clock,
  CheckCircle, XCircle, AlertCircle, Plus, Trash2,
  ExternalLink, Filter, Search, ChevronRight,
  BarChart3, Zap, ArrowUpRight, Shield, CreditCard,
} from "lucide-react";

/* ─── Styles ─── */
const PD_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --sg-bg: #ffffff;
    --sg-surface: #f8fafc;
    --sg-surface2: #f1f5f9;
    --sg-accent: #3b82f6;
    --sg-accent2: #0ea5e9;
    --sg-cyan: #06b6d4;
    --sg-text: #1e293b;
    --sg-muted: #64748b;
    --sg-border: rgba(0,0,0,0.08);
    --sg-glow: rgba(59,130,246,0.15);
  }

  * { box-sizing: border-box; }

  .pd-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    padding: 5.5rem 5% 4rem;
    position: relative;
  }
  .pd-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 90% 5%, rgba(59,130,246,.07) 0%, transparent 65%),
      radial-gradient(ellipse 55% 50% at 5% 90%, rgba(14,165,233,.05) 0%, transparent 65%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(99,102,241,.03) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .pd-wrap { position:relative; z-index:1; max-width:1360px; margin:0 auto; }

  /* ── HEADER ── */
  .pd-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.2rem;
    margin-bottom: 2rem;
    padding: 1.8rem 2.2rem;
    background: linear-gradient(135deg, #fff 0%, var(--sg-surface) 100%);
    border: 1px solid var(--sg-border);
    border-radius: 28px;
    box-shadow: 0 2px 12px rgba(0,0,0,.05), 0 8px 32px rgba(0,0,0,.04);
    position: relative;
    overflow: hidden;
  }
  .pd-header::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--sg-accent), var(--sg-cyan), var(--sg-accent2));
    opacity: 0.6;
  }
  .pd-header-left { display: flex; align-items: center; gap: 1.2rem; }
  .pd-header-avatar {
    width: 52px; height: 52px; border-radius: 16px;
    background: linear-gradient(135deg, rgba(59,130,246,.15) 0%, rgba(6,182,212,.12) 100%);
    border: 1.5px solid rgba(59,130,246,.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pd-page-title {
    font-family: 'Inter', sans-serif; font-weight: 800;
    font-size: clamp(1.5rem, 3vw, 2rem); letter-spacing: -1px;
    background: linear-gradient(135deg, var(--sg-text) 0%, var(--sg-accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; line-height: 1.1;
  }
  .pd-page-sub {
    color: var(--sg-muted); font-size: .85rem; margin-top: .3rem;
    font-weight: 400;
  }
  .pd-header-actions { display: flex; align-items: center; gap: .75rem; }
  .pd-add-btn {
    display: flex; align-items: center; gap: .5rem;
    padding: .7rem 1.4rem; border-radius: 14px;
    background: linear-gradient(135deg, var(--sg-accent) 0%, #60a5fa 100%);
    color: #fff; border: none;
    font-family: 'Inter', sans-serif; font-weight: 600; font-size: .85rem;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(59,130,246,.35), 0 1px 3px rgba(0,0,0,.1);
    transition: all .25s cubic-bezier(.4,0,.2,1);
    position: relative; overflow: hidden; letter-spacing: .01em;
  }
  .pd-add-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,.15) 50%, transparent 60%);
    transform: translateX(-100%); transition: transform .5s;
  }
  .pd-add-btn:hover::after { transform: translateX(100%); }
  .pd-add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(59,130,246,.45), 0 2px 6px rgba(0,0,0,.12);
  }
  .pd-add-btn:active { transform: translateY(0); }
  .pd-add-btn.cancel {
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    box-shadow: none; color: var(--sg-muted);
  }
  .pd-add-btn.cancel::after { display: none; }
  .pd-add-btn.cancel:hover {
    background: var(--sg-surface); color: var(--sg-text);
    box-shadow: 0 2px 8px rgba(0,0,0,.06);
  }

  /* ── ANALYTICS GRID ── */
  .pd-analytics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  @media(max-width:900px) { .pd-analytics { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:500px) { .pd-analytics { grid-template-columns: 1fr; } }

  .pd-stat-card {
    background: #fff;
    border: 1px solid var(--sg-border);
    border-radius: 22px;
    padding: 1.5rem 1.6rem 1.4rem;
    transition: all .25s cubic-bezier(.4,0,.2,1);
    position: relative; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .pd-stat-card::before {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: var(--sc-accent-color, var(--sg-accent));
    transform: scaleX(0); transform-origin: left;
    transition: transform .3s cubic-bezier(.4,0,.2,1);
  }
  .pd-stat-card:hover::before { transform: scaleX(1); }
  .pd-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(0,0,0,.09), 0 2px 8px rgba(0,0,0,.05);
    border-color: rgba(59,130,246,.15);
  }

  .pd-stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.1rem; }
  .pd-stat-icon {
    width: 44px; height: 44px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .pd-stat-trend {
    font-size: .7rem; font-weight: 700; padding: .22rem .6rem;
    border-radius: 100px; display: flex; align-items: center; gap: .2rem;
    letter-spacing: .02em;
  }
  .pd-stat-trend.up   { background: rgba(74,222,128,.12); color: #16a34a; }
  .pd-stat-trend.down { background: rgba(255,107,107,.12); color: #dc2626; }

  .pd-stat-value {
    font-family: 'Inter', sans-serif; font-weight: 800;
    font-size: clamp(1.6rem, 2.5vw, 2.1rem); letter-spacing: -1.5px;
    color: var(--sg-text); line-height: 1; margin-bottom: .4rem;
  }
  .pd-stat-label {
    font-size: .73rem; color: var(--sg-muted); font-weight: 500; letter-spacing: .02em;
    text-transform: uppercase;
  }

  /* ── ADD SERVICE FORM ── */
  .pd-add-form {
    background: linear-gradient(135deg, #fff 0%, var(--sg-surface) 100%);
    border: 1px solid rgba(59,130,246,.2);
    border-radius: 22px; padding: 1.8rem; margin-bottom: 1.5rem;
    box-shadow: 0 4px 20px rgba(59,130,246,.08);
    animation: pd-slide-in .25s cubic-bezier(.4,0,.2,1);
  }
  @keyframes pd-slide-in {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pd-add-form-head { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.4rem; }
  .pd-add-form-icon {
    width: 42px; height: 42px; border-radius: 13px;
    background: rgba(59,130,246,.1); border: 1px solid rgba(59,130,246,.2);
    display: flex; align-items: center; justify-content: center;
  }
  .pd-add-form-title { font-family: 'Inter', sans-serif; font-weight: 700; font-size: .97rem; color: var(--sg-text); }
  .pd-add-form-sub   { font-size: .76rem; color: var(--sg-muted); margin-top: .15rem; }

  /* ── LAYOUT ── */
  .pd-layout {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.2rem;
    align-items: start;
  }
  @media(max-width:1100px) { .pd-layout { grid-template-columns: 1fr 1fr; } }
  @media(max-width:700px)  { .pd-layout { grid-template-columns: 1fr; } }

  .pd-col-main  { grid-column: span 2; display: flex; flex-direction: column; gap: 1.2rem; }
  .pd-col-side  { display: flex; flex-direction: column; gap: 1.2rem; }
  @media(max-width:1100px) { .pd-col-main { grid-column: span 2; } .pd-col-side { grid-column: span 2; } }
  @media(max-width:700px)  { .pd-col-main, .pd-col-side { grid-column: span 1; } }

  /* ── CARDS ── */
  .pd-card {
    background: #fff;
    border: 1px solid var(--sg-border);
    border-radius: 22px;
    padding: 1.6rem;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    transition: box-shadow .25s;
  }
  .pd-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); }

  .pd-card-head {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: .8rem; margin-bottom: 1.3rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--sg-border);
  }
  .pd-card-head-left { display: flex; align-items: center; gap: .9rem; }
  .pd-card-head-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .pd-card-title { font-family: 'Inter', sans-serif; font-weight: 700; font-size: .95rem; color: var(--sg-text); }
  .pd-card-sub   { font-size: .73rem; color: var(--sg-muted); margin-top: .15rem; font-weight: 400; }

  .pd-link-btn {
    display: flex; align-items: center; gap: .35rem;
    color: var(--sg-accent); text-decoration: none; font-size: .78rem; font-weight: 600;
    padding: .4rem .9rem; border-radius: 100px;
    border: 1px solid rgba(59,130,246,.2);
    background: rgba(59,130,246,.06);
    transition: all .2s; white-space: nowrap; letter-spacing: .01em;
  }
  .pd-link-btn:hover { background: rgba(59,130,246,.12); border-color: rgba(59,130,246,.35); }

  /* ── SERVICE ROWS ── */
  .pd-svc-list { display: flex; flex-direction: column; gap: .6rem; }
  .pd-svc-row {
    display: flex; align-items: center; gap: 1rem;
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 14px;
    padding: 1rem 1.1rem;
    transition: all .22s cubic-bezier(.4,0,.2,1);
    position: relative;
  }
  .pd-svc-row:hover {
    background: linear-gradient(135deg, rgba(59,130,246,.03) 0%, var(--sg-surface) 100%);
    border-color: rgba(59,130,246,.2);
    box-shadow: 0 2px 12px rgba(59,130,246,.08);
    transform: translateX(3px);
  }

  .pd-svc-icon {
    width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
    background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.15);
    display: flex; align-items: center; justify-content: center;
  }
  .pd-svc-name { font-family: 'Inter', sans-serif; font-weight: 600; font-size: .85rem; color: var(--sg-text); }
  .pd-svc-cat {
    font-size: .63rem; font-weight: 600; padding: .13rem .48rem;
    border-radius: 100px;
    background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.15);
    color: var(--sg-accent); margin-left: .4rem; letter-spacing: .02em; text-transform: uppercase;
  }
  .pd-svc-desc {
    font-size: .75rem; color: var(--sg-muted); margin-top: .12rem;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 320px;
  }
  .pd-svc-price { font-family: 'Inter', sans-serif; font-weight: 800; font-size: .92rem; color: var(--sg-accent); }
  .pd-svc-rating {
    display: flex; align-items: center; gap: .25rem; font-size: .72rem; color: var(--sg-muted); margin-top: .18rem;
  }

  .pd-del-btn {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    background: none; border: 1px solid var(--sg-border); cursor: pointer;
    color: var(--sg-muted); transition: all .2s; display: flex; align-items: center; justify-content: center;
  }
  .pd-del-btn:hover { background: rgba(255,107,107,.08); border-color: rgba(255,107,107,.25); color: #ef4444; }

  /* ── SEARCH & FILTER ── */
  .pd-search-row {
    display: flex; gap: .6rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;
  }
  .pd-search-box {
    display: flex; align-items: center; gap: .5rem; flex: 1; min-width: 160px;
    background: var(--sg-surface); border: 1px solid var(--sg-border);
    border-radius: 11px; padding: .55rem .85rem;
    transition: border-color .2s, box-shadow .2s;
  }
  .pd-search-box:focus-within {
    border-color: rgba(59,130,246,.4);
    box-shadow: 0 0 0 3px rgba(59,130,246,.08);
  }
  .pd-search-box input {
    background: none; border: none; outline: none; width: 100%;
    font-family: 'Inter', sans-serif; font-size: .83rem; color: var(--sg-text);
  }
  .pd-search-box input::placeholder { color: var(--sg-muted); }
  .pd-filter-wrap {
    display: flex; align-items: center; gap: .4rem;
    background: var(--sg-surface); border: 1px solid var(--sg-border);
    border-radius: 11px; padding: .55rem .85rem;
  }
  .pd-filter-select {
    background: none; border: none; outline: none;
    font-family: 'Inter', sans-serif; font-size: .8rem; color: var(--sg-text); cursor: pointer;
  }

  /* ── BOOKING ROWS ── */
  .pd-booking-list { display: flex; flex-direction: column; gap: .6rem; }
  .pd-booking-row {
    display: flex; align-items: center; gap: .9rem;
    background: var(--sg-surface); border: 1px solid var(--sg-border);
    border-radius: 14px; padding: .9rem 1.1rem;
    transition: all .22s cubic-bezier(.4,0,.2,1);
    position: relative;
  }
  .pd-booking-row.emergency {
    border-color: rgba(255,107,107,.2);
    background: linear-gradient(135deg, rgba(255,107,107,.03) 0%, var(--sg-surface) 100%);
  }
  .pd-booking-row:hover { 
    box-shadow: 0 3px 12px rgba(0,0,0,.07); 
    border-color: rgba(59,130,246,.18);
    transform: translateX(2px);
  }

  .pd-booking-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .pd-booking-title { font-family: 'Inter', sans-serif; font-weight: 600; font-size: .83rem; color: var(--sg-text); }
  .pd-booking-meta  { font-size: .72rem; color: var(--sg-muted); margin-top: .12rem; }
  .pd-emg-badge {
    display: inline-flex; align-items: center; gap: .2rem;
    font-size: .62rem; font-weight: 700; padding: .1rem .45rem;
    border-radius: 100px; background: rgba(255,107,107,.12);
    color: #ef4444; margin-left: .4rem; letter-spacing: .03em; text-transform: uppercase;
  }

  /* status badges */
  .pd-status-badge {
    font-size: .68rem; font-weight: 700; padding: .22rem .65rem;
    border-radius: 100px; white-space: nowrap; flex-shrink: 0;
    letter-spacing: .03em; text-transform: uppercase;
  }
  .pd-status-pending   { background: rgba(251,191,36,.1);  color: #d97706; border: 1px solid rgba(251,191,36,.25); }
  .pd-status-accepted  { background: rgba(6,182,212,.1);   color: #0891b2; border: 1px solid rgba(6,182,212,.25);  }
  .pd-status-completed { background: rgba(74,222,128,.1);  color: #16a34a; border: 1px solid rgba(74,222,128,.25); }
  .pd-status-rejected  { background: rgba(255,107,107,.1); color: #dc2626; border: 1px solid rgba(255,107,107,.25);}
  .pd-status-cancelled { background: rgba(100,116,139,.1); color: var(--sg-muted); border: 1px solid var(--sg-border); }

  .pd-action-btns { display: flex; gap: .35rem; flex-shrink: 0; }
  .pd-action-btn {
    width: 30px; height: 30px; border-radius: 9px;
    background: none; border: 1px solid var(--sg-border); cursor: pointer;
    color: var(--sg-muted); transition: all .2s;
    display: flex; align-items: center; justify-content: center;
  }
  .pd-action-btn.accept:hover  { background: rgba(74,222,128,.1);  border-color: rgba(74,222,128,.3);  color: #16a34a; }
  .pd-action-btn.reject:hover  { background: rgba(255,107,107,.1); border-color: rgba(255,107,107,.3); color: #ef4444; }

  .pd-complete-btn {
    font-size: .73rem; font-weight: 700; padding: .3rem .8rem;
    background: rgba(6,182,212,.08); border: 1px solid rgba(6,182,212,.2);
    border-radius: 100px; color: var(--sg-cyan); cursor: pointer;
    transition: all .2s; white-space: nowrap; letter-spacing: .02em;
  }
  .pd-complete-btn:hover { background: rgba(6,182,212,.16); border-color: rgba(6,182,212,.35); }

  /* ── STATUS BREAKDOWN ── */
  .pd-status-rows { display: flex; flex-direction: column; gap: .9rem; }
  .pd-status-row-item { }
  .pd-status-row-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: .45rem; }
  .pd-status-row-left { display: flex; align-items: center; gap: .55rem; }
  .pd-status-row-icon {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .pd-status-row-label { font-size: .76rem; color: var(--sg-muted); font-weight: 500; }
  .pd-status-row-count { font-size: .8rem; font-weight: 700; color: var(--sg-text); }
  .pd-bar-track { height: 5px; background: var(--sg-surface2); border-radius: 100px; overflow: hidden; }
  .pd-bar-fill  { height: 100%; border-radius: 100px; transition: width .7s cubic-bezier(.4,0,.2,1); }

  /* ── PRO TIPS ── */
  .pd-tips {
    background: linear-gradient(135deg, rgba(59,130,246,.05) 0%, rgba(6,182,212,.04) 100%);
    border: 1px solid rgba(59,130,246,.14);
    border-radius: 20px; padding: 1.4rem;
  }
  .pd-tips-head { display: flex; align-items: center; gap: .8rem; margin-bottom: 1rem; }
  .pd-tips-icon {
    width: 36px; height: 36px; border-radius: 11px;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.2);
    display: flex; align-items: center; justify-content: center;
  }
  .pd-tips-title { font-family: 'Inter', sans-serif; font-weight: 700; font-size: .9rem; color: var(--sg-text); }
  .pd-tips ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .6rem; }
  .pd-tips li {
    display: flex; align-items: flex-start; gap: .6rem;
    font-size: .78rem; color: var(--sg-muted); line-height: 1.55;
    padding: .55rem .7rem; border-radius: 10px;
    background: rgba(255,255,255,.6); border: 1px solid rgba(255,255,255,.8);
  }
  .pd-tips-arrow { color: var(--sg-accent); flex-shrink: 0; font-weight: 700; font-size: .85rem; margin-top: .05rem; }

  /* ── PERFORMANCE ── */
  .pd-perf {
    background: #fff; border: 1px solid var(--sg-border); border-radius: 20px; padding: 1.4rem;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .pd-perf-head { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--sg-border); }
  .pd-perf-icon { width: 36px; height: 36px; border-radius: 11px; background: rgba(74,222,128,.1); border: 1px solid rgba(74,222,128,.2); display: flex; align-items: center; justify-content: center; }
  .pd-perf-title { font-family: 'Inter', sans-serif; font-weight: 700; font-size: .9rem; color: var(--sg-text); }
  .pd-perf-rows { display: flex; flex-direction: column; gap: .85rem; }
  .pd-perf-row-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: .38rem; }
  .pd-perf-row-label { font-size: .76rem; color: var(--sg-muted); font-weight: 500; }
  .pd-perf-row-val   { font-size: .8rem; font-weight: 700; color: var(--sg-text); }

  /* ── EMPTY STATES ── */
  .pd-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2.5rem 1.5rem; text-align: center; gap: .6rem;
  }
  .pd-empty-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: var(--sg-surface2); border: 1px solid var(--sg-border);
    display: flex; align-items: center; justify-content: center; color: var(--sg-muted);
    margin-bottom: .4rem;
  }
  .pd-empty h4 { font-size: .9rem; font-weight: 700; color: var(--sg-text); margin: 0; }
  .pd-empty p  { font-size: .78rem; color: var(--sg-muted); margin: 0; }
  .pd-empty-cta {
    display: flex; align-items: center; gap: .4rem;
    padding: .55rem 1.1rem; border-radius: 10px;
    background: linear-gradient(135deg, var(--sg-accent), #60a5fa);
    color: #fff; border: none; font-family: 'Inter', sans-serif;
    font-weight: 600; font-size: .8rem; cursor: pointer; margin-top: .4rem;
    box-shadow: 0 4px 14px rgba(59,130,246,.3);
    transition: all .2s;
  }
  .pd-empty-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,.4); }

  /* spinner */
  .pd-spinner {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2.5px solid var(--sg-surface2); border-top-color: var(--sg-accent);
    animation: pd-spin .7s linear infinite; margin: 2rem auto;
  }
  @keyframes pd-spin { to { transform: rotate(360deg); } }

  /* ── SECTION DIVIDER LABEL ── */
  .pd-section-label {
    font-size: .68rem; font-weight: 700; color: var(--sg-muted);
    text-transform: uppercase; letter-spacing: .1em;
    padding: .3rem .7rem; border-radius: 100px;
    background: var(--sg-surface2); border: 1px solid var(--sg-border);
    white-space: nowrap;
  }
`;

function InjectPDStyle() {
  useEffect(() => {
    if (!document.getElementById("pd-style")) {
      const el = document.createElement("style");
      el.id = "pd-style";
      el.textContent = PD_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ── sub-components ── */
function StatCard({ title, value, icon: Icon, trend, trendUp, iconBg, iconColor, accentColor }: {
  title: string; value: string | number;
  icon: React.ElementType; trend?: string; trendUp?: boolean;
  iconBg: string; iconColor: string; accentColor?: string;
}) {
  return (
    <div className="pd-stat-card" style={{ "--sc-accent-color": accentColor || "var(--sg-accent)" } as any}>
      <div className="pd-stat-top">
        <div className="pd-stat-icon" style={{ background: iconBg }}>
          <Icon size={19} style={{ color: iconColor }} />
        </div>
        {trend && (
          <span className={`pd-stat-trend ${trendUp ? "up" : "down"}`}>
            <ArrowUpRight size={10} />
            {trend}
          </span>
        )}
      </div>
      <div className="pd-stat-value">{value}</div>
      <div className="pd-stat-label">{title}</div>
    </div>
  );
}

function StatusRow({ label, count, total, barColor, iconBg, iconColor, icon: Icon }: {
  label: string; count: number; total: number;
  barColor: string; iconBg: string; iconColor: string;
  icon: React.ElementType;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="pd-status-row-item">
      <div className="pd-status-row-top">
        <div className="pd-status-row-left">
          <div className="pd-status-row-icon" style={{ background: iconBg }}>
            <Icon size={13} style={{ color: iconColor }} />
          </div>
          <span className="pd-status-row-label">{label}</span>
        </div>
        <span className="pd-status-row-count">{count}</span>
      </div>
      <div className="pd-bar-track">
        <div className="pd-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}

function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    pending:   "pd-status-badge pd-status-pending",
    accepted:  "pd-status-badge pd-status-accepted",
    completed: "pd-status-badge pd-status-completed",
    rejected:  "pd-status-badge pd-status-rejected",
    cancelled: "pd-status-badge pd-status-cancelled",
  };
  return map[status] ?? "pd-status-badge pd-status-cancelled";
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
interface Service {
  _id: string; title: string; description: string;
  category: string; price: number;
  averageRating: number; totalReviews: number; createdAt: string;
}
interface Booking {
  _id: string; service: { title: string; price?: number };
  user: { name: string }; status: string; date: string; isEmergency: boolean;
}

function ProviderDashboard() {
  const { user } = useAuth();
  const [services, setServices]     = useState<Service[]>([]);
  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const svcRes = await axios.get("https://servixobackend.vercel.app/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(svcRes.data.filter((s: any) => s.provider?._id === user?.id || s.provider === user?.id));
      const bkRes = await axios.get("https://servixobackend.vercel.app/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bkRes.data.slice(0, 5));
    } catch { toast.error("Failed to load dashboard data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const stats = useMemo(() => {
    const completed = bookings.filter((b) => b.status === "completed");
    const earnings  = completed.reduce((a, b) => a + (b.service?.price || 0), 0);
    return {
      totalServices:     services.length,
      totalBookings:     bookings.length,
      pendingBookings:   bookings.filter((b) => b.status === "pending").length,
      acceptedBookings:  bookings.filter((b) => b.status === "accepted").length,
      completedBookings: completed.length,
      rejectedBookings:  bookings.filter((b) => b.status === "rejected").length,
      averageRating: services.length > 0
        ? (services.reduce((a, s) => a + (s.averageRating || 0), 0) / services.length).toFixed(1)
        : "0.0",
      totalEarnings: earnings,
      conversionRate: bookings.length > 0
        ? Math.round((completed.length / bookings.length) * 100) : 0,
    };
  }, [services, bookings]);

  const filteredBookings = bookings.filter((b) => {
    const matchSearch = b.service?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await axios.delete(`https://servixobackend.vercel.app/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service deleted");
      fetchData();
    } catch { toast.error("Delete failed"); }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await axios.put(`https://servixobackend.vercel.app/api/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Booking ${status}`);
      fetchData();
    } catch { toast.error("Update failed"); }
  };

  return (
    <>
      <InjectPDStyle />
      <div className="pd-root">
        <div className="pd-wrap">

          {/* ── HEADER ── */}
          <div className="pd-header">
            <div className="pd-header-left">
              <div className="pd-header-avatar">
                <Briefcase size={22} style={{ color: "var(--sg-accent)" }} />
              </div>
              <div>
                <h1 className="pd-page-title">Provider Dashboard</h1>
                <p className="pd-page-sub">Manage services, track performance &amp; handle bookings</p>
              </div>
            </div>
            <div className="pd-header-actions">
              {showAddForm && (
                <button className="pd-add-btn cancel" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              )}
              <button className="pd-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
                <Plus size={15} /> {showAddForm ? "Close Form" : "Add Service"}
              </button>
            </div>
          </div>

          {/* ── ANALYTICS ── */}
          <div className="pd-analytics">
            <StatCard
              title="Total Earnings" value={`₹${stats.totalEarnings.toLocaleString()}`}
              icon={TrendingUp} trend="+12%" trendUp
              iconBg="rgba(74,222,128,.12)" iconColor="#16a34a" accentColor="#4ade80"
            />
            <StatCard
              title="Active Services" value={stats.totalServices}
              icon={Briefcase}
              iconBg="rgba(59,130,246,.1)" iconColor="var(--sg-accent)" accentColor="var(--sg-accent)"
            />
            <StatCard
              title="Conversion Rate" value={`${stats.conversionRate}%`}
              icon={BarChart3} trend="+5%" trendUp
              iconBg="rgba(6,182,212,.1)" iconColor="var(--sg-cyan)" accentColor="var(--sg-cyan)"
            />
            <StatCard
              title="Avg Rating" value={stats.averageRating}
              icon={Star}
              iconBg="rgba(251,191,36,.1)" iconColor="#d97706" accentColor="#fbbf24"
            />
          </div>

          {/* ── ADD SERVICE FORM ── */}
          {showAddForm && (
            <div className="pd-add-form">
              <div className="pd-add-form-head">
                <div className="pd-add-form-icon">
                  <Plus size={17} style={{ color: "var(--sg-accent)" }} />
                </div>
                <div>
                  <div className="pd-add-form-title">Add New Service</div>
                  <div className="pd-add-form-sub">Create a new service offering for customers</div>
                </div>
              </div>
              <AddService compact onServiceAdded={() => { fetchData(); setShowAddForm(false); }} />
            </div>
          )}

          {/* ── MAIN LAYOUT ── */}
          <div className="pd-layout">

            {/* ── LEFT/MAIN COLUMN ── */}
            <div className="pd-col-main">

              {/* My Services */}
              <div className="pd-card">
                <div className="pd-card-head">
                  <div className="pd-card-head-left">
                    <div className="pd-card-head-icon" style={{ background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.15)" }}>
                      <Briefcase size={17} style={{ color: "var(--sg-accent)" }} />
                    </div>
                    <div>
                      <div className="pd-card-title">My Services</div>
                      <div className="pd-card-sub">
                        {services.length > 0 ? `${services.length} active listing${services.length !== 1 ? "s" : ""}` : "Manage your service listings"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                    <span className="pd-section-label">{services.length} total</span>
                    <Link to="/services" className="pd-link-btn">
                      Browse <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>

                {loading ? <div className="pd-spinner" /> :
                 services.length === 0 ? (
                  <div className="pd-empty">
                    <div className="pd-empty-icon"><Briefcase size={24} /></div>
                    <h4>No services yet</h4>
                    <p>Add your first service to start receiving bookings</p>
                    <button className="pd-empty-cta" onClick={() => setShowAddForm(true)}>
                      <Plus size={13} /> Add Service
                    </button>
                  </div>
                ) : (
                  <div className="pd-svc-list">
                    {services.map((s) => (
                      <div key={s._id} className="pd-svc-row">
                        <div className="pd-svc-icon">
                          <Briefcase size={17} style={{ color: "var(--sg-accent)" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                            <span className="pd-svc-name">{s.title}</span>
                            <span className="pd-svc-cat">{s.category}</span>
                          </div>
                          <div className="pd-svc-desc">{s.description}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div className="pd-svc-price">₹{s.price}</div>
                          <div className="pd-svc-rating">
                            <Star size={11} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                            {s.averageRating?.toFixed(1) || "0.0"}
                            <span style={{ opacity: .5 }}>({s.totalReviews || 0})</span>
                          </div>
                        </div>
                        <button className="pd-del-btn" onClick={() => handleDeleteService(s._id)} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Management */}
              <div className="pd-card">
                <div className="pd-card-head">
                  <div className="pd-card-head-left">
                    <div className="pd-card-head-icon" style={{ background: "rgba(6,182,212,.08)", border: "1px solid rgba(6,182,212,.15)" }}>
                      <CalendarDays size={17} style={{ color: "var(--sg-cyan)" }} />
                    </div>
                    <div>
                      <div className="pd-card-title">Booking Requests</div>
                      <div className="pd-card-sub">Manage and respond to customers</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                    {stats.pendingBookings > 0 && (
                      <span className="pd-section-label" style={{ color: "#d97706", borderColor: "rgba(251,191,36,.25)", background: "rgba(251,191,36,.08)" }}>
                        {stats.pendingBookings} pending
                      </span>
                    )}
                    <Link to="/provider/bookings" className="pd-link-btn">
                      View All <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>

                {/* search + filter */}
                <div className="pd-search-row">
                  <div className="pd-search-box">
                    <Search size={13} style={{ color: "var(--sg-muted)", flexShrink: 0 }} />
                    <input
                      placeholder="Search by service or customer…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="pd-filter-wrap">
                    <Filter size={13} style={{ color: "var(--sg-muted)" }} />
                    <select className="pd-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {loading ? <div className="pd-spinner" /> :
                 filteredBookings.length === 0 ? (
                  <div className="pd-empty">
                    <div className="pd-empty-icon"><CalendarDays size={24} /></div>
                    <h4>No bookings found</h4>
                    <p>{searchQuery || filterStatus !== "all" ? "Try adjusting your filters" : "Booking requests will appear here"}</p>
                  </div>
                ) : (
                  <div className="pd-booking-list">
                    {filteredBookings.slice(0, 6).map((b) => (
                      <div key={b._id} className={`pd-booking-row ${b.isEmergency ? "emergency" : ""}`}>
                        <div className="pd-booking-icon" style={{
                          background: b.isEmergency ? "rgba(255,107,107,.1)" : "rgba(6,182,212,.08)",
                          border: `1px solid ${b.isEmergency ? "rgba(255,107,107,.2)" : "rgba(6,182,212,.15)"}`,
                        }}>
                          {b.isEmergency
                            ? <Zap size={15} style={{ color: "#ef4444" }} />
                            : <CalendarDays size={15} style={{ color: "var(--sg-cyan)" }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="pd-booking-title">
                            {b.service?.title}
                            {b.isEmergency && <span className="pd-emg-badge"><Zap size={9} /> Emergency</span>}
                          </div>
                          <div className="pd-booking-meta">
                            {b.user?.name} &nbsp;·&nbsp; {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>
                        <span className={statusBadgeClass(b.status)}>{b.status}</span>
                        {b.status === "pending" && (
                          <div className="pd-action-btns">
                            <button className="pd-action-btn accept" onClick={() => updateBookingStatus(b._id, "accepted")} title="Accept">
                              <CheckCircle size={14} />
                            </button>
                            <button className="pd-action-btn reject" onClick={() => updateBookingStatus(b._id, "rejected")} title="Reject">
                              <XCircle size={14} />
                            </button>
                          </div>
                        )}
                        {b.status === "accepted" && (
                          <button className="pd-complete-btn" onClick={() => updateBookingStatus(b._id, "completed")}>
                            Complete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <div className="pd-col-side">

              {/* Verification Status */}
              <div className="pd-card">
                <div className="pd-card-head">
                  <div className="pd-card-head-left">
                    <div className="pd-card-head-icon" style={{ background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.15)" }}>
                      <Shield size={17} style={{ color: "#10b981" }} />
                    </div>
                    <div>
                      <div className="pd-card-title">Verification Status</div>
                      <div className="pd-card-sub">Complete your profile verification</div>
                    </div>
                  </div>
                  <Link to="/provider/verification" className="pd-link-btn">
                    Manage <ChevronRight size={12} />
                  </Link>
                </div>
                <div className="pd-status-rows">
                  <StatusRow label="Identity"   count={1}   total={3} barColor="#3b82f6" iconBg="rgba(59,130,246,.1)"  iconColor="#3b82f6" icon={Shield} />
                  <StatusRow label="Professional"  count={0}  total={2} barColor="#10b981" iconBg="rgba(16,185,129,.1)"   iconColor="#10b981" icon={Briefcase} />
                  <StatusRow label="Bank & Photo" count={1} total={2} barColor="#f59e0b" iconBg="rgba(245,158,11,.1)" iconColor="#f59e0b" icon={Shield} />
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="pd-card">
                <div className="pd-card-head">
                  <div className="pd-card-head-left">
                    <div className="pd-card-head-icon" style={{ background: "rgba(139,92,246,.08)", border: "1px solid rgba(139,92,246,.15)" }}>
                      <BarChart3 size={17} style={{ color: "#8b5cf6" }} />
                    </div>
                    <div>
                      <div className="pd-card-title">Booking Status</div>
                      <div className="pd-card-sub">{stats.totalBookings} total bookings</div>
                    </div>
                  </div>
                </div>
                <div className="pd-status-rows">
                  <StatusRow label="Pending"   count={stats.pendingBookings}   total={stats.totalBookings} barColor="#fbbf24" iconBg="rgba(251,191,36,.1)"  iconColor="#d97706" icon={Clock} />
                  <StatusRow label="Accepted"  count={stats.acceptedBookings}  total={stats.totalBookings} barColor="#22d3ee" iconBg="rgba(6,182,212,.1)"   iconColor="#0891b2" icon={CheckCircle} />
                  <StatusRow label="Completed" count={stats.completedBookings} total={stats.totalBookings} barColor="#4ade80" iconBg="rgba(74,222,128,.1)"  iconColor="#16a34a" icon={CheckCircle} />
                  <StatusRow label="Rejected"  count={stats.rejectedBookings}  total={stats.totalBookings} barColor="#f87171" iconBg="rgba(248,113,113,.1)" iconColor="#dc2626" icon={XCircle} />
                </div>
              </div>

              {/* Performance */}
              <div className="pd-perf">
                <div className="pd-perf-head">
                  <div className="pd-perf-icon"><TrendingUp size={17} style={{ color: "#16a34a" }} /></div>
                  <div>
                    <div className="pd-perf-title">Performance</div>
                  </div>
                </div>
                <div className="pd-perf-rows">
                  {[
                    { label: "Response Rate",         val: "92%",                     pct: 92,                                               color: "#4ade80" },
                    { label: "Completion Rate",        val: `${stats.conversionRate}%`, pct: stats.conversionRate,                            color: "#22d3ee" },
                    { label: "Customer Satisfaction",  val: `${stats.averageRating}/5`, pct: (parseFloat(stats.averageRating as string)/5)*100, color: "#fbbf24" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="pd-perf-row-top">
                        <span className="pd-perf-row-label">{row.label}</span>
                        <span className="pd-perf-row-val">{row.val}</span>
                      </div>
                      <div className="pd-bar-track">
                        <div className="pd-bar-fill" style={{ width: `${row.pct}%`, background: row.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div className="pd-tips">
                <div className="pd-tips-head">
                  <div className="pd-tips-icon"><AlertCircle size={16} style={{ color: "var(--sg-accent)" }} /></div>
                  <div className="pd-tips-title">Pro Tips</div>
                </div>
                <ul>
                  {[
                    "Respond to bookings within 24 hours for better ratings",
                    "Mark completed jobs promptly to track earnings",
                    "Add detailed descriptions to attract more customers",
                    "Emergency bookings often lead to repeat customers",
                  ].map((tip) => (
                    <li key={tip}>
                      <span className="pd-tips-arrow">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ProviderDashboard;
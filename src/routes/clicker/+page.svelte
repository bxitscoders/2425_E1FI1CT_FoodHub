<svelte:head>
	<title>Foodhub - Burger Empire 💰</title>
	<link rel="stylesheet" href="/clicker-enhanced.css" />
</svelte:head>

<!-- Help Button -->
<button class="help-button" onclick={() => showHelp = !showHelp} title="Hilfe & Anleitung (Drücke H)">
	<span class="help-icon">❓</span>
</button>

<!-- Quick Tutorial for First-Time Players -->
{#if totalClicks === 0 && !showHelp}
	<div class="tutorial-overlay">
		<div class="tutorial-arrow">👇</div>
		<div class="tutorial-text">
			Klicke auf den Burger um zu starten!
		</div>
	</div>
{/if}

{#if totalClicks > 0 && totalClicks < 10 && totalUpgradesBought === 0}
	<div class="tutorial-overlay-shop">
		<div class="tutorial-arrow-right">👈</div>
		<div class="tutorial-text">
			Kaufe dein erstes Upgrade im Shop!
		</div>
	</div>
{/if}

<!-- Help Modal -->
{#if showHelp}
	<div class="help-modal" role="button" tabindex="0" onclick={() => showHelp = false} onkeydown={(e) => e.key === 'Escape' && (showHelp = false)}>
		<div class="help-content" role="dialog" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
			<button class="help-close" onclick={() => showHelp = false}>✖</button>
			<h2 style="color:#ff9000;text-align:center;margin-bottom:20px;">🍔 Spielanleitung</h2>
			<div class="help-section">
				<h3>🎮 Grundlagen</h3>
				<p><strong>Ziel:</strong> Baue dein Burger-Imperium auf und verdiene so viel Geld wie möglich!</p>
				<p><strong>Klicken:</strong> Klicke auf den großen Burger, um Geld zu verdienen</p>
				<p><strong>Upgrades:</strong> Kaufe Upgrades im Shop, um automatisches Einkommen zu erhalten</p>
			</div>
			<div class="help-section">
				<h3>⭐ Prestige System</h3>
				<p>Ab 1 Million € kannst du Prestige machen:</p>
				<ul>
					<li>Erhalte permanente Prestige-Punkte</li>
					<li>Jeder Punkt = +5% auf alle Einnahmen</li>
					<li>Verliere alle Upgrades & Geld (behalte Achievements)</li>
				</ul>
			</div>
			<div class="help-section">
				<h3>🎁 Tägliche Features</h3>
				<p><strong>Tägliche Belohnung:</strong> Einmal pro Tag Bonus-Geld abholen</p>
				<p><strong>Challenges:</strong> Erfülle tägliche Aufgaben für Extra-Belohnungen</p>
			</div>
			<div class="help-section">
				<h3>⚡ Power-Ups</h3>
				<p><strong>Boosts:</strong> Kaufe temporäre Multiplikatoren im Boost Shop</p>
				<p><strong>Events:</strong> Zufällige Events geben Boni oder Herausforderungen</p>
				<p><strong>Golden Burger:</strong> Erscheint zufällig - klicke für 7x Multiplikator!</p>
			</div>
			<div class="help-section">
				<h3>👥 Team & Forschung</h3>
				<p><strong>Mitarbeiter:</strong> Stelle Personal ein für permanente Boni</p>
				<p><strong>Forschung:</strong> Schalte neue Technologien für Verbesserungen frei</p>
			</div>
			<div class="help-section">
				<h3>🎰 Mini-Games</h3>
				<p><strong>Slot Machine:</strong> Setze 1.000€ für Gewinnchance</p>
				<p><strong>Burger Flipper:</strong> Schnell-Klick-Spiel für Bonus-Geld</p>
			</div>
			<div class="help-section">
				<h3>💡 Tipps</h3>
				<ul>
					<li>Kaufe zuerst günstige Upgrades für schnellen Start</li>
					<li>Balance zwischen Klick-Upgrades und passivem Einkommen</li>
					<li>Nutze Boosts bei hohem passivem Einkommen</li>
					<li>Mache Prestige, wenn Fortschritt langsam wird</li>
					<li>Achte auf den Markt-Multiplikator!</li>
				</ul>
			</div>
			<div class="help-section">
				<h3>⌨️ Tastatur-Shortcuts</h3>
				<ul>
					<li><strong>Leertaste / Enter:</strong> Burger klicken</li>
					<li><strong>H oder ?:</strong> Diese Hilfe öffnen/schließen</li>
					<li><strong>ESC:</strong> Hilfe schließen</li>
				</ul>
			</div>
		</div>
	</div>
{/if}

<div class="news-ticker" id="newsTicker">
	<span class="ticker-icon">🍔</span>
	<span class="ticker-text">Willkommen beim Burger Empire! Baue dein Fast-Food-Imperium auf...</span>
</div>
<div id="goldenBurger" class="golden-burger">🍔</div>
<button id="soundToggle" class="sound-toggle">
	<span class="sound-icon">{soundEnabled ? '🔊' : '🔇'}</span>
	<span class="sound-text">{soundEnabled ? 'Sound An' : 'Sound Aus'}</span>
</button>

<div class="game-layout">
	<div class="left-panel">
		<div class="clicker-area" id="clickerArea">
			{#if prestigeLevel > 0}
				<div class="prestige-badge">
					<span class="prestige-icon">⭐</span>
					<span class="prestige-text">Prestige {prestigeLevel}</span>
					<span class="prestige-bonus">+{prestigeLevel * 5}%</span>
				</div>
			{/if}
			<div class="money-display">
				<div class="money-counter" id="money">{formatNumber(money)} €</div>
				<div class="income-display" id="income">+{formatNumber(incomePerSecond)} €/Sek</div>
			</div>
			<button class="burger-btn" id="burgerBtn" onclick={handleClick}>
				<span class="burger-emoji">🍔</span>
			</button>
			<div class="click-info">
				<span class="click-label">Klick-Wert:</span>
				<span class="click-value" id="clickValue">{formatNumber(clickValue)} €</span>
			</div>
		</div>

		<div class="stats-box">
			<div class="stat-item">
				<div class="stat-icon">👆</div>
				<div class="stat-content">
					<div class="stat-label">Gesamt-Klicks</div>
					<div class="stat-value">{totalClicks.toLocaleString('de-DE')}</div>
				</div>
			</div>
			<div class="stat-item">
				<div class="stat-icon">🛒</div>
				<div class="stat-content">
					<div class="stat-label">Upgrades</div>
					<div class="stat-value">{totalUpgradesBought}</div>
				</div>
			</div>
			<div class="stat-item">
				<div class="stat-icon">💰</div>
				<div class="stat-content">
					<div class="stat-label">€ pro Klick</div>
					<div class="stat-value">{formatNumber(clickValue)}</div>
				</div>
			</div>
			<div class="stat-item">
				<div class="stat-icon">⚡</div>
				<div class="stat-content">
					<div class="stat-label">€ pro Sekunde</div>
					<div class="stat-value">{formatNumber(incomePerSecond)}</div>
				</div>
			</div>
		</div>

		<div class="action-buttons">
			<button class="action-btn achievements-btn" onclick={showAchievementsModal}>
				<span class="btn-icon">🏆</span>
				<span class="btn-text">Achievements</span>
				<span class="badge">{achievements.filter((a) => a.shown).length}/{achievements.length}</span>
			</button>
			<button class="action-btn stats-btn" onclick={showStatsModal}>
				<span class="btn-icon">📊</span>
				<span class="btn-text">Statistik</span>
			</button>
		</div>

		<div class="upgrades-list">
			<h3 class="upgrades-title">
				<span class="title-icon">🛒</span>
				<span>Upgrades Shop</span>
				<button class="info-tooltip" title="Kaufe Upgrades für passives Einkommen und höhere Klick-Werte">ℹ️</button>
			</h3>
			<div id="upgradesContainer">
				{#each upgrades as upgrade}
					{@const cost = getCost(upgrade)}
					{@const canAfford = money >= cost}
					{@const percentToAfford = money / cost * 100}
					{@const effectText =
						upgrade.clickBonus > 0 && upgrade.owned > 0
							? `+${formatNumber(upgrade.clickBonus * upgrade.owned * prestigeBonus)} €/Klick`
							: upgrade.clickBonus > 0
								? `+${formatNumber(upgrade.clickBonus * prestigeBonus)} €/Klick`
								: upgrade.owned > 0
									? `+${formatNumber(upgrade.baseIncome * upgrade.owned * prestigeBonus)} €/Sek`
									: `+${formatNumber(upgrade.baseIncome * prestigeBonus)} €/Sek`}
					<div
						class="upgrade-item"
						class:disabled={!canAfford}
						class:almost-affordable={!canAfford && percentToAfford >= 50}
						role="button"
						tabindex="0"
						title={!canAfford ? `Noch ${formatNumber(cost - money)}€ benötigt` : 'Klicken zum Kaufen'}
						onclick={() => canAfford && buyUpgrade(upgrade.id)}
						onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && canAfford && buyUpgrade(upgrade.id)}
					>
						<div class="upgrade-icon">{upgrade.icon}</div>
						<div class="upgrade-info">
							<div class="upgrade-name">{upgrade.name}</div>
							<div class="upgrade-stats">{effectText} | Besitz: {upgrade.owned}</div>
						</div>
						<div class="upgrade-cost" class:affordable={canAfford}>
							{formatNumber(cost)} €
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="right-panel">
		<div class="distribution-panel">
			<h2 class="panel-title">
				<span class="title-icon">💰</span>
				<span>Geldverteilung</span>
			</h2>
			<div class="total-earned">
				<div class="total-earned-label">GESAMTUMSATZ</div>
				<div class="total-earned-amount">{formatNumber(totalEarned)} €</div>
			</div>
			<div class="contributors-container">
				{#each team as member}
					{@const earned = totalEarned * member.share}
					{@const percentage = (member.share * 100).toFixed(0)}
					<div class="contributor {member.class}">
						<div class="contributor-header">
							<div class="contributor-icon">{member.icon}</div>
							<div class="contributor-details">
								<div class="contributor-name">{member.name}</div>
								<div class="contributor-role">{member.role}</div>
							</div>
						</div>
						<div class="money-earned">{formatNumber(earned)} €</div>
						<div class="percentage-bar">
							<div class="percentage-fill" style="width:{percentage}%"></div>
						</div>
						<div class="percentage-text">{percentage}% vom Gesamtumsatz</div>
					</div>
				{/each}
			</div>
			<button
				class="prestige-btn"
				class:can-prestige={totalEarned >= 1000000}
				disabled={totalEarned < 1000000}
				onclick={showPrestigeModal}
			>
				<span class="btn-icon">⭐</span>
				<span class="btn-text">
					{#if totalEarned >= 1000000}
						PRESTIGE ({calculatePrestigePoints()} Punkte)
					{:else}
						PRESTIGE (Benötigt 1M €)
					{/if}
				</span>
			</button>
			<button class="reset-btn" onclick={resetGame}>
				<span class="btn-icon">🔄</span>
				<span class="btn-text">Spiel zurücksetzen</span>
			</button>
		</div>

		<!-- Neue Features Panels -->
		
		<!-- Daily Reward Panel -->
		<div class="feature-panel">
			<h3 class="feature-title">
				🎁 Tägliche Belohnung
				<button class="info-tooltip" title="Hole dir jeden Tag eine kostenlose Belohnung ab! Wert: 10 Minuten passives Einkommen">ℹ️</button>
			</h3>
			{#if !dailyRewardClaimed}
				<button class="feature-btn primary" onclick={claimDailyReward}>
					<span class="btn-icon">🎁</span>
					<span>Belohnung abholen!</span>
				</button>
			{:else}
				<div class="claimed-badge">✅ Bereits abgeholt</div>
				<p style="text-align:center;color:#888;margin-top:10px;font-size:14px;">Komm morgen wieder!</p>
			{/if}
		</div>

		<!-- Daily Challenge -->
		{#if dailyChallenge}
			<div class="feature-panel">
				<h3 class="feature-title">
					🎯 Tägliche Challenge
					<button class="info-tooltip" title="Erfülle die tägliche Challenge für eine Extra-Belohnung!">ℹ️</button>
				</h3>
				<div class="challenge-info">
					<div class="challenge-name">{dailyChallenge.name}</div>
					<div class="challenge-desc">{dailyChallenge.desc}</div>
					<div class="progress-bar">
						<div class="progress-fill" style="width:{Math.min(100, (challengeProgress / dailyChallenge.target) * 100)}%"></div>
					</div>
					<div class="challenge-progress">
						{formatNumber(challengeProgress)} / {formatNumber(dailyChallenge.target)}
					</div>
					<div class="challenge-reward">
						🏆 Belohnung: {formatNumber(dailyChallenge.reward)}€
					</div>
				</div>
			</div>
		{/if}

		<!-- Market Status -->
		<div class="feature-panel">
			<h3 class="feature-title">
				📈 Markt Status
				<button class="info-tooltip" title="Der Markt schwankt zufällig und beeinflusst deine Einnahmen. Ändert sich alle 2 Minuten.">ℹ️</button>
			</h3>
			<div class="market-info">
				<div class="market-trend" class:up={marketTrend === 'up'} class:down={marketTrend === 'down'}>
					{marketTrend === 'up' ? '📈 BOOM!' : marketTrend === 'down' ? '📉 CRASH!' : '➡️ STABIL'}
				</div>
				<div class="market-multiplier">
					Multiplikator: {marketMultiplier.toFixed(2)}x
				</div>
			</div>
		</div>

		<!-- Active Boosts -->
		{#if activeBoosts.length > 0}
			<div class="feature-panel">
				<h3 class="feature-title">⚡ Aktive Boosts</h3>
				<div class="boosts-list">
					{#each activeBoosts as boost}
						{@const timeLeft = Math.ceil((boost.endTime - Date.now()) / 1000)}
						<div class="boost-item">
							<span class="boost-name">{boost.name}</span>
							<span class="boost-time">{timeLeft}s</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Current Event -->
		{#if currentEvent}
			<div class="feature-panel event-panel">
				<h3 class="feature-title">🎉 Event: {currentEvent.name}</h3>
				<div class="event-info">
					<div class="event-desc">
						{currentEvent.effect === 'income' ? `${currentEvent.multiplier}x Einkommen!` :
						 currentEvent.effect === 'click' ? `${currentEvent.multiplier}x Klick-Wert!` :
						 currentEvent.effect === 'both' ? `${currentEvent.multiplier}x Alles!` :
						 currentEvent.effect === 'penalty' ? `${currentEvent.multiplier}x Strafe` : ''}
					</div>
					<div class="event-time">⏱️ {eventTimeLeft}s verbleibend</div>
				</div>
			</div>
		{/if}

		<!-- Boosts Shop -->
		<div class="feature-panel">
			<h3 class="feature-title">
				⚡ Boost Shop
				<button class="info-tooltip" title="Kaufe temporäre Power-Ups für massive Multiplikatoren! Am besten bei hohem passivem Einkommen nutzen.">ℹ️</button>
			</h3>
			<div class="boosts-shop">
				{#each boostTypes as boost}
					{@const canAfford = money >= boost.cost}
					<button 
						class="boost-buy-btn"
						class:disabled={!canAfford}
						onclick={() => canAfford && activateBoost(boost.id)}
					>
						<span class="boost-icon">{boost.name}</span>
						<span class="boost-stats">{boost.multiplier}x • {boost.duration}s</span>
						<span class="boost-cost">{formatNumber(boost.cost)}€</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Mini Games -->
		<div class="feature-panel">
			<h3 class="feature-title">
				🎮 Mini-Games
				<button class="info-tooltip" title="Spiele Mini-Games für zusätzliches Geld! Slot Machine kostet 1.000€, Burger Flipper ist kostenlos.">ℹ️</button>
			</h3>
			<div class="minigames-container">
				<button 
					class="minigame-btn"
					onclick={startSlotMachine}
					disabled={slotMachineSpinning || money < 1000}
				>
					<span class="game-icon">🎰</span>
					<span class="game-name">Slot Machine</span>
					<span class="game-cost">1.000€</span>
				</button>
				<button 
					class="minigame-btn"
					onclick={startBurgerFlipper}
					disabled={burgerFlipperActive}
				>
					<span class="game-icon">🍔</span>
					<span class="game-name">Burger Flipper</span>
					<span class="game-cost">Kostenlos!</span>
				</button>
			</div>
			{#if burgerFlipperActive}
				<div class="flipper-game">
					<div class="flipper-score">Score: {flipperScore}</div>
					<button class="flipper-btn" onclick={flipBurger}>
						🍔 FLIP!
					</button>
				</div>
			{/if}
		</div>

		<!-- Employees -->
		<div class="feature-panel">
			<h3 class="feature-title">
				👥 Mitarbeiter
				<button class="info-tooltip" title="Stelle Mitarbeiter ein für permanente Boni! Jeder Mitarbeiter-Typ kann mehrfach eingestellt werden.">ℹ️</button>
			</h3>
			<div class="employees-list">
				{#each employeeTypes as emp}
					{@const canAfford = money >= emp.cost && emp.hired < emp.max}
					<button 
						class="employee-btn"
						class:disabled={!canAfford}
						onclick={() => canAfford && hireEmployee(emp.id)}
					>
						<span class="emp-icon">{emp.name}</span>
						<span class="emp-count">{emp.hired}/{emp.max}</span>
						<span class="emp-cost">{formatNumber(emp.cost)}€</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Research -->
		<div class="feature-panel">
			<h3 class="feature-title">
				🔬 Forschung
				<button class="info-tooltip" title="Erforsche neue Technologien für permanente Verbesserungen! Manche benötigen Voraussetzungen.">ℹ️</button>
			</h3>
			<div class="research-list">
				{#each researchOptions as r}
					{@const canAfford = money >= r.cost && !r.researched}
					{@const reqsMet = r.requires.every(reqId => {
						const req = researchOptions.find(o => o.id === reqId);
						return req && req.researched;
					})}
					<button 
						class="research-btn"
						class:disabled={!canAfford || !reqsMet}
						class:researched={r.researched}
						onclick={() => canAfford && reqsMet && doResearch(r.id)}
					>
						<span class="research-name">{r.name}</span>
						<span class="research-status">
							{r.researched ? '✅ Erforscht' : `${formatNumber(r.cost)}€`}
						</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

<div class="achiev-modal" id="achievModal">
	<div class="achiev-inner">
		<h2 style="color:#ff9000;text-align:center;">🏆 Achievements</h2>
		<ul class="achiev-list" id="achievList"></ul>
		<button class="achiev-close" onclick={hideAchievementsModal}>Schließen</button>
	</div>
</div>

<div class="stats-modal" id="statsModal">
	<div class="stats-inner">
		<h2 style="color:#ff9000;text-align:center;">📊 Statistiken</h2>
		<div style="color:#fff;line-height:2;">
			<p><strong>Spielzeit:</strong> <span id="playTime">0:00:00</span></p>
			<p><strong>Gesamt-Klicks:</strong> <span id="statsClicks">0</span></p>
			<p><strong>Burger-Wert:</strong> <span id="statsBurgerValue">1 €</span></p>
			<p><strong>Pro Sekunde:</strong> <span id="statsPerSec">0 €</span></p>
			<p><strong>Prestige Level:</strong> <span id="statsPrestige">0</span></p>
			<p><strong>Prestige Bonus:</strong> <span id="statsPrestigeBonus">+0%</span></p>
			<p><strong>Achievements:</strong> <span id="statsAchiev">0/0</span></p>
			<p><strong>Wrinklers geplatzt:</strong> <span id="statsWrinklers">0</span></p>
		</div>
		<button class="stats-close" onclick={hideStatsModal}>Schließen</button>
	</div>
</div>

<div class="prestige-modal" id="prestigeModal">
	<div class="prestige-inner">
		<h2 style="color:gold;text-align:center;">⭐ PRESTIGE AUFSTIEG ⭐</h2>
		<div style="color:#fff;text-align:center;line-height:2;padding:20px;">
			<p style="font-size:18px;"><strong>Du erhältst:</strong></p>
			<p style="font-size:32px;color:gold;font-weight:bold;" id="prestigePoints">0 Prestige-Punkte</p>
			<p style="color:#aaa;">Jeder Prestige-Punkt gibt <strong>+5%</strong> auf alle Einnahmen!</p>
			<p style="margin-top:20px;color:#ff6666;"><strong>⚠️ Du verlierst:</strong></p>
			<p>• Alle Upgrades<br />• Alles Geld<br />• Alle Klicks</p>
			<p style="margin-top:20px;color:#66ff66;"><strong>✓ Du behältst:</strong></p>
			<p>• Achievements<br />• Prestige-Punkte (permanenter Bonus!)</p>
		</div>
		<button
			onclick={doPrestige}
			style="width:100%;background:linear-gradient(135deg,gold,orange);color:#000;border:none;padding:15px;font-weight:bold;border-radius:10px;font-size:18px;cursor:pointer;margin-bottom:10px;"
			>⭐ AUFSTEIGEN</button
		>
		<button class="prestige-close" onclick={hidePrestigeModal}>Abbrechen</button>
	</div>
</div>

<style>
	:global(body) {
		background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
		overflow-x: hidden;
		min-height: 100vh;
	}

	.news-ticker {
		background: linear-gradient(90deg, #000 0%, #1a1a1a 50%, #000 100%);
		color: #ff9000;
		padding: 12px 20px;
		text-align: center;
		font-size: 14px;
		border-bottom: 2px solid #ff9000;
		box-shadow: 0 2px 10px rgba(255, 144, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		animation: slideDown 0.5s ease-out;
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.ticker-icon {
		font-size: 18px;
		animation: bounce 2s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	.ticker-text {
		font-weight: 500;
		letter-spacing: 0.5px;
	}

	.game-layout {
		display: grid;
		grid-template-columns: 1fr 450px;
		gap: 20px;
		max-width: 1600px;
		margin: 20px auto;
		padding: 0 20px;
	}

	.left-panel {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.clicker-area {
		background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
		border-radius: 20px;
		padding: 50px 40px;
		text-align: center;
		position: relative;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 144, 0, 0.2);
	}

	.money-display {
		margin-bottom: 30px;
	}

	.money-counter {
		font-size: 64px;
		font-weight: 800;
		color: #ff9000;
		margin-bottom: 8px;
		text-shadow: 0 0 30px rgba(255, 144, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.5);
		animation: glow 2s ease-in-out infinite;
		letter-spacing: -1px;
	}

	@keyframes glow {
		0%,
		100% {
			text-shadow: 0 0 30px rgba(255, 144, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.5);
		}
		50% {
			text-shadow: 0 0 40px rgba(255, 144, 0, 0.9), 0 4px 15px rgba(0, 0, 0, 0.7);
		}
	}

	.income-display {
		color: #bbb;
		font-size: 22px;
		font-weight: 600;
		margin-bottom: 10px;
	}

	.prestige-badge {
		position: absolute;
		top: 15px;
		right: 15px;
		background: linear-gradient(135deg, #ffd700, #ff9000);
		color: #000;
		padding: 10px 18px;
		border-radius: 25px;
		font-weight: bold;
		font-size: 14px;
		box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
		display: flex;
		align-items: center;
		gap: 8px;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	.prestige-icon {
		font-size: 16px;
	}

	.prestige-text {
		font-size: 13px;
	}

	.prestige-bonus {
		background: rgba(0, 0, 0, 0.2);
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 12px;
	}

	.burger-btn {
		width: 300px;
		height: 300px;
		font-size: 180px;
		background: radial-gradient(circle at 30% 30%, #ffb347, #ff9000, #e07e00);
		border: 10px solid #ff9000;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		margin: 20px auto;
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		box-shadow: 0 15px 50px rgba(255, 144, 0, 0.6), inset 0 -5px 20px rgba(0, 0, 0, 0.2);
		position: relative;
		overflow: hidden;
	}

	.burger-btn::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
		animation: rotate 4s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.burger-emoji {
		position: relative;
		z-index: 1;
		filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
	}

	.burger-btn:hover {
		transform: scale(1.1) rotate(5deg);
		box-shadow: 0 20px 60px rgba(255, 144, 0, 0.8), inset 0 -5px 20px rgba(0, 0, 0, 0.2);
		border-color: #ffb347;
	}

	.burger-btn:active {
		transform: scale(0.95);
		box-shadow: 0 8px 30px rgba(255, 144, 0, 0.4), inset 0 -3px 15px rgba(0, 0, 0, 0.3);
	}

	.click-info {
		margin-top: 25px;
		padding: 12px 24px;
		background: rgba(255, 144, 0, 0.1);
		border-radius: 15px;
		display: inline-block;
		border: 1px solid rgba(255, 144, 0, 0.3);
	}

	.click-label {
		color: #aaa;
		font-size: 16px;
		margin-right: 8px;
	}

	.click-value {
		color: #ff9000;
		font-weight: bold;
		font-size: 24px;
		text-shadow: 0 2px 10px rgba(255, 144, 0, 0.4);
	}

	.action-buttons {
		display: flex;
		gap: 12px;
	}

	.action-btn {
		flex: 1;
		background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
		border: 2px solid rgba(255, 144, 0, 0.3);
		color: #fff;
		padding: 16px;
		border-radius: 15px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		position: relative;
		overflow: hidden;
	}

	.action-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
		transition: left 0.5s;
	}

	.action-btn:hover::before {
		left: 100%;
	}

	.action-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 144, 0, 0.3);
		border-color: rgba(255, 144, 0, 0.6);
	}

	.achievements-btn {
		background: linear-gradient(135deg, #ffb347, #ff9000);
		color: #000;
	}

	.stats-btn {
		background: linear-gradient(135deg, #5aa9ff, #4a9eff);
	}

	.btn-icon {
		font-size: 20px;
	}

	.btn-text {
		font-size: 16px;
	}

	.badge {
		background: rgba(0, 0, 0, 0.3);
		padding: 4px 10px;
		border-radius: 12px;
		font-size: 13px;
		margin-left: 5px;
	}

	.upgrades-list {
		background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
		border-radius: 20px;
		padding: 25px;
		max-height: 600px;
		overflow-y: auto;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 144, 0, 0.2);
	}

	.upgrades-list::-webkit-scrollbar {
		width: 8px;
	}

	.upgrades-list::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 10px;
	}

	.upgrades-list::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #ff9000, #e07e00);
		border-radius: 10px;
	}

	.upgrades-title {
		margin: 0 0 20px 0;
		color: #ff9000;
		font-size: 26px;
		display: flex;
		align-items: center;
		gap: 10px;
		padding-bottom: 15px;
		border-bottom: 2px solid rgba(255, 144, 0, 0.3);
	}

	.title-icon {
		font-size: 28px;
	}

	:global(.upgrade-item) {
		background: linear-gradient(135deg, #2a2a2a, #252525);
		border-radius: 15px;
		padding: 20px;
		margin-bottom: 14px;
		display: flex;
		align-items: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		border: 2px solid rgba(255, 144, 0, 0.2);
		position: relative;
		overflow: hidden;
	}

	:global(.upgrade-item::before) {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 144, 0, 0.1), transparent);
		transition: left 0.5s;
	}

	:global(.upgrade-item:hover:not(.disabled)::before) {
		left: 100%;
	}

	:global(.upgrade-item:hover:not(.disabled)) {
		border-color: #ff9000;
		transform: translateX(10px) scale(1.02);
		box-shadow: 0 5px 25px rgba(255, 144, 0, 0.3);
	}

	:global(.upgrade-item.disabled) {
		opacity: 0.5;
		cursor: not-allowed;
		filter: grayscale(0.5);
	}

	:global(.upgrade-item.almost-affordable) {
		opacity: 0.75;
		border-color: rgba(255, 144, 0, 0.4);
		animation: almostAffordable 1.5s ease-in-out infinite;
	}

	@keyframes almostAffordable {
		0%, 100% {
			border-color: rgba(255, 144, 0, 0.4);
		}
		50% {
			border-color: rgba(255, 144, 0, 0.7);
		}
	}

	:global(.upgrade-icon) {
		font-size: 50px;
		margin-right: 20px;
		min-width: 50px;
		filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3));
		transition: transform 0.3s ease;
	}

	:global(.upgrade-item:hover:not(.disabled) .upgrade-icon) {
		transform: scale(1.2) rotate(10deg);
	}

	:global(.upgrade-info) {
		flex: 1;
	}

	:global(.upgrade-name) {
		font-weight: bold;
		font-size: 19px;
		margin-bottom: 6px;
		color: #fff;
	}

	:global(.upgrade-stats) {
		font-size: 14px;
		color: #aaa;
	}

	:global(.upgrade-cost) {
		background: linear-gradient(135deg, #ffb347, #ff9000);
		color: #000;
		padding: 12px 20px;
		border-radius: 25px;
		font-weight: bold;
		font-size: 16px;
		white-space: nowrap;
		box-shadow: 0 3px 15px rgba(255, 144, 0, 0.3);
		transition: all 0.3s ease;
	}

	:global(.upgrade-cost.affordable) {
		animation: affordable 1s ease-in-out infinite;
	}

	@keyframes affordable {
		0%, 100% {
			box-shadow: 0 3px 15px rgba(255, 144, 0, 0.3);
		}
		50% {
			box-shadow: 0 5px 25px rgba(255, 144, 0, 0.6);
		}
	}

	:global(.upgrade-item:hover:not(.disabled) .upgrade-cost) {
		transform: scale(1.1);
		box-shadow: 0 5px 20px rgba(255, 144, 0, 0.5);
	}

	.right-panel {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.distribution-panel {
		background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
		border-radius: 20px;
		padding: 30px;
		max-height: 85vh;
		overflow-y: auto;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 144, 0, 0.2);
	}

	.distribution-panel::-webkit-scrollbar {
		width: 8px;
	}

	.distribution-panel::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 10px;
	}

	.distribution-panel::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #ff9000, #e07e00);
		border-radius: 10px;
	}

	.panel-title {
		margin: 0 0 25px 0;
		color: #ff9000;
		font-size: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding-bottom: 20px;
		border-bottom: 2px solid rgba(255, 144, 0, 0.3);
	}

	.total-earned {
		background: linear-gradient(135deg, #ff9000, #e07e00);
		border-radius: 12px;
		padding: 20px;
		text-align: center;
		margin-bottom: 25px;
		box-shadow: 0 4px 15px rgba(255, 144, 0, 0.4);
	}

	.total-earned-label {
		color: #000;
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 5px;
	}

	.total-earned-amount {
		color: #000;
		font-size: 36px;
		font-weight: bold;
	}

	:global(.contributor) {
		background-color: #2a2a2a;
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 18px;
		border-left: 5px solid #ff9000;
		transition: all 0.3s ease;
	}

	:global(.contributor:hover) {
		transform: translateX(5px);
		box-shadow: 0 4px 15px rgba(255, 144, 0, 0.3);
	}

	:global(.contributor.ceo) {
		border-left-color: #ffd700;
		background: linear-gradient(135deg, #2a2a2a, #3a3a2a);
	}

	:global(.contributor.co-ceo) {
		border-left-color: #c0c0c0;
	}

	:global(.contributor.bettler) {
		border-left-color: #cd7f32;
		opacity: 0.9;
	}

	:global(.contributor-header) {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
	}

	:global(.contributor-icon) {
		font-size: 40px;
		margin-right: 15px;
	}

	:global(.contributor-name) {
		font-weight: bold;
		font-size: 18px;
	}

	:global(.contributor-role) {
		font-size: 13px;
		color: #888;
		margin-top: 2px;
	}

	:global(.money-earned) {
		font-size: 28px;
		font-weight: bold;
		color: #ff9000;
		margin: 12px 0;
	}

	:global(.percentage-bar) {
		background-color: #333;
		height: 10px;
		border-radius: 10px;
		overflow: hidden;
		margin-top: 10px;
	}

	:global(.percentage-fill) {
		background: linear-gradient(90deg, #ff9000, #ffb347);
		height: 100%;
		transition: width 0.5s ease;
	}

	:global(.percentage-text) {
		font-size: 13px;
		color: #aaa;
		margin-top: 8px;
	}

	:global(.click-effect) {
		position: fixed;
		font-size: 28px;
		font-weight: bold;
		color: #ff9000;
		pointer-events: none;
		animation: floatUp 1.2s ease-out forwards;
		z-index: 1000;
		text-shadow: 0 0 10px rgba(255, 144, 0, 0.8);
	}

	@keyframes floatUp {
		to {
			transform: translateY(-120px);
			opacity: 0;
		}
	}

	.stats-box {
		background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
		border-radius: 20px;
		padding: 25px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 144, 0, 0.2);
	}

	.stat-item {
		background: rgba(0, 0, 0, 0.3);
		padding: 18px;
		border-radius: 15px;
		display: flex;
		align-items: center;
		gap: 12px;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 144, 0, 0.1);
	}

	.stat-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 20px rgba(255, 144, 0, 0.2);
		border-color: rgba(255, 144, 0, 0.3);
	}

	.stat-icon {
		font-size: 32px;
		filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3));
	}

	.stat-content {
		flex: 1;
	}

	.stat-label {
		font-size: 11px;
		color: #888;
		text-transform: uppercase;
		margin-bottom: 5px;
		letter-spacing: 1px;
		font-weight: 600;
	}

	.stat-value {
		font-size: 24px;
		font-weight: bold;
		color: #ff9000;
		text-shadow: 0 2px 10px rgba(255, 144, 0, 0.4);
	}

	.reset-btn,
	.prestige-btn {
		background: linear-gradient(135deg, #ff3333, #cc0000);
		border: 2px solid rgba(255, 51, 51, 0.5);
		color: #fff;
		padding: 16px 24px;
		border-radius: 15px;
		font-weight: bold;
		font-size: 16px;
		cursor: pointer;
		margin-top: 15px;
		transition: all 0.3s ease;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		box-shadow: 0 5px 20px rgba(255, 51, 51, 0.3);
	}

	.prestige-btn {
		background: linear-gradient(135deg, #ffd700, #ff9000);
		border-color: rgba(255, 215, 0, 0.5);
		color: #000;
		box-shadow: 0 5px 25px rgba(255, 215, 0, 0.4);
	}

	.prestige-btn.can-prestige {
		animation: prestigePulse 2s infinite;
	}

	@keyframes prestigePulse {
		0%,
		100% {
			box-shadow: 0 5px 25px rgba(255, 215, 0, 0.4);
		}
		50% {
			box-shadow: 0 8px 35px rgba(255, 215, 0, 0.7);
		}
	}

	.prestige-btn:hover:not(:disabled) {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 8px 30px rgba(255, 215, 0, 0.6);
	}

	.prestige-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		filter: grayscale(0.5);
	}

	.reset-btn:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 8px 30px rgba(255, 51, 51, 0.5);
	}

	:global(.achievement-popup) {
		position: fixed;
		bottom: 40px;
		left: 50%;
		transform: translateX(-50%);
		background: #ffd700;
		color: #222;
		border-radius: 12px;
		font-weight: bold;
		font-size: 22px;
		padding: 18px 32px;
		box-shadow: 0 8px 32px rgba(255, 144, 0, 0.5);
		z-index: 2000;
		animation: fadeInUp 0.6s;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.achiev-modal,
	.stats-modal,
	.prestige-modal {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.85);
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.achiev-inner,
	.stats-inner,
	.prestige-inner {
		background: #222;
		padding: 35px;
		border-radius: 20px;
		max-width: 500px;
		box-shadow: 0 0 40px rgba(255, 144, 0, 0.7);
		max-height: 80vh;
		overflow-y: auto;
	}

	.prestige-inner {
		background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
		border: 3px solid gold;
	}

	.achiev-list {
		list-style: none;
		padding: 0;
		margin: 0 0 12px 0;
		max-height: 300px;
		overflow-y: auto;
	}

	:global(.achiev-list li) {
		background: #2a2a2a;
		margin-bottom: 10px;
		padding: 12px 15px;
		border-radius: 12px;
		font-size: 16px;
	}

	:global(.achiev-list li.complete) {
		color: #d7ff97;
		border: 2px solid #b1ff4c;
	}

	:global(.achiev-list li.incomplete) {
		color: #888;
	}

	.achiev-close,
	.stats-close,
	.prestige-close {
		margin-top: 14px;
		width: 100%;
		background: #ff3333;
		border: none;
		color: #fff;
		padding: 11px;
		font-weight: bold;
		border-radius: 9px;
		cursor: pointer;
	}

	.achiev-close:hover,
	.stats-close:hover,
	.prestige-close:hover {
		background: #cc0000;
	}

	.golden-burger {
		display: none;
		position: fixed;
		top: 120px;
		right: 60px;
		font-size: 100px;
		cursor: pointer;
		z-index: 1500;
		animation: goldenFloat 3s ease-in-out infinite;
		filter: drop-shadow(0 0 20px gold);
		transition: transform 0.3s ease;
	}

	.golden-burger:hover {
		transform: scale(1.2) rotate(15deg);
	}

	@keyframes goldenFloat {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
			filter: drop-shadow(0 0 20px gold);
		}
		25% {
			transform: translateY(-15px) rotate(5deg);
			filter: drop-shadow(0 0 30px orange);
		}
		50% {
			transform: translateY(0) rotate(0deg);
			filter: drop-shadow(0 0 40px gold);
		}
		75% {
			transform: translateY(-15px) rotate(-5deg);
			filter: drop-shadow(0 0 30px orange);
		}
	}

	:global(.wrinkler) {
		position: absolute;
		width: 60px;
		height: 60px;
		font-size: 50px;
		cursor: pointer;
		z-index: 100;
		animation: wrinklerWiggle 2s ease-in-out infinite;
		filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.5));
		transition: transform 0.2s ease;
	}

	:global(.wrinkler:hover) {
		transform: scale(1.3);
		animation: none;
	}

	@keyframes wrinklerWiggle {
		0%,
		100% {
			transform: rotate(-8deg) scale(1);
		}
		25% {
			transform: rotate(8deg) scale(1.05);
		}
		50% {
			transform: rotate(-8deg) scale(1);
		}
		75% {
			transform: rotate(8deg) scale(1.05);
		}
	}

	.sound-toggle {
		position: fixed;
		bottom: 30px;
		right: 30px;
		background: linear-gradient(135deg, #ff9000, #e07e00);
		color: #000;
		border: 3px solid rgba(255, 144, 0, 0.5);
		padding: 14px 22px;
		border-radius: 50px;
		cursor: pointer;
		font-weight: bold;
		z-index: 3000;
		display: flex;
		align-items: center;
		gap: 10px;
		box-shadow: 0 5px 25px rgba(255, 144, 0, 0.4);
		transition: all 0.3s ease;
	}

	.sound-toggle:hover {
		transform: translateY(-3px) scale(1.05);
		box-shadow: 0 8px 35px rgba(255, 144, 0, 0.6);
	}

	.sound-icon {
		font-size: 20px;
	}

	.sound-text {
		font-size: 15px;
	}

	/* Help Button */
	.help-button {
		position: fixed;
		top: 80px;
		right: 30px;
		width: 60px;
		height: 60px;
		background: linear-gradient(135deg, #4caf50, #2e7d32);
		border: 3px solid rgba(76, 175, 80, 0.5);
		border-radius: 50%;
		cursor: pointer;
		font-size: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 3000;
		box-shadow: 0 5px 25px rgba(76, 175, 80, 0.4);
		transition: all 0.3s ease;
		animation: helpPulse 2s ease-in-out infinite;
	}

	@keyframes helpPulse {
		0%, 100% {
			box-shadow: 0 5px 25px rgba(76, 175, 80, 0.4);
		}
		50% {
			box-shadow: 0 8px 35px rgba(76, 175, 80, 0.7);
		}
	}

	.help-button:hover {
		transform: scale(1.1) rotate(15deg);
		box-shadow: 0 8px 35px rgba(76, 175, 80, 0.7);
	}

	.help-icon {
		color: #fff;
		font-weight: bold;
	}

	/* Help Modal */
	.help-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10000;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.help-content {
		background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
		border: 2px solid #ff9000;
		border-radius: 20px;
		padding: 40px;
		max-width: 700px;
		max-height: 85vh;
		overflow-y: auto;
		position: relative;
		box-shadow: 0 20px 60px rgba(255, 144, 0, 0.5);
		animation: slideUp 0.4s ease;
	}

	@keyframes slideUp {
		from {
			transform: translateY(50px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.help-content::-webkit-scrollbar {
		width: 8px;
	}

	.help-content::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 10px;
	}

	.help-content::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #ff9000, #e07e00);
		border-radius: 10px;
	}

	.help-close {
		position: absolute;
		top: 15px;
		right: 15px;
		background: #ff3333;
		border: none;
		color: #fff;
		width: 35px;
		height: 35px;
		border-radius: 50%;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.help-close:hover {
		background: #cc0000;
		transform: rotate(90deg);
	}

	.help-section {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 20px;
		border-left: 4px solid #ff9000;
	}

	.help-section h3 {
		color: #ff9000;
		margin-top: 0;
		margin-bottom: 15px;
		font-size: 20px;
	}

	.help-section p {
		color: #ddd;
		line-height: 1.8;
		margin: 10px 0;
	}

	.help-section ul {
		color: #ddd;
		line-height: 1.8;
		margin: 10px 0;
		padding-left: 25px;
	}

	.help-section li {
		margin: 8px 0;
	}

	.help-section strong {
		color: #ffb347;
	}

	/* Info Tooltip Button */
	.info-tooltip {
		background: rgba(255, 144, 0, 0.2);
		border: 1px solid rgba(255, 144, 0, 0.4);
		color: #ff9000;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		cursor: help;
		font-size: 12px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;
		transition: all 0.3s ease;
	}

	.info-tooltip:hover {
		background: rgba(255, 144, 0, 0.3);
		transform: scale(1.15);
		box-shadow: 0 0 15px rgba(255, 144, 0, 0.5);
	}

	.upgrades-title {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	/* Tutorial Overlays */
	.tutorial-overlay {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 5000;
		text-align: center;
		pointer-events: none;
		animation: tutorialBounce 2s ease-in-out infinite;
	}

	@keyframes tutorialBounce {
		0%, 100% {
			transform: translate(-50%, -50%);
		}
		50% {
			transform: translate(-50%, -60%);
		}
	}

	.tutorial-arrow {
		font-size: 64px;
		margin-bottom: 20px;
		animation: tutorialRotate 2s ease-in-out infinite;
	}

	@keyframes tutorialRotate {
		0%, 100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(-10deg);
		}
		75% {
			transform: rotate(10deg);
		}
	}

	.tutorial-text {
		background: linear-gradient(135deg, #ff9000, #e07e00);
		color: #000;
		padding: 20px 30px;
		border-radius: 15px;
		font-size: 24px;
		font-weight: bold;
		box-shadow: 0 10px 40px rgba(255, 144, 0, 0.6);
		border: 3px solid #ffb347;
		animation: tutorialGlow 1.5s ease-in-out infinite;
	}

	@keyframes tutorialGlow {
		0%, 100% {
			box-shadow: 0 10px 40px rgba(255, 144, 0, 0.6);
		}
		50% {
			box-shadow: 0 15px 50px rgba(255, 144, 0, 0.9);
		}
	}

	.tutorial-overlay-shop {
		position: fixed;
		bottom: 150px;
		left: 50px;
		z-index: 5000;
		display: flex;
		align-items: center;
		gap: 20px;
		pointer-events: none;
		animation: tutorialSlide 2s ease-in-out infinite;
	}

	@keyframes tutorialSlide {
		0%, 100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(-15px);
		}
	}

	.tutorial-arrow-right {
		font-size: 48px;
		animation: tutorialRotate 2s ease-in-out infinite;
	}

	@media (max-width: 1200px) {
		.game-layout {
			grid-template-columns: 1fr;
		}

		.help-content {
			max-width: 90%;
			padding: 25px;
		}

		.help-button {
			width: 50px;
			height: 50px;
			font-size: 24px;
		}

		.tutorial-overlay-shop {
			bottom: 100px;
			left: 20px;
		}

		.tutorial-text {
			font-size: 18px;
			padding: 15px 20px;
		}

		.tutorial-arrow {
			font-size: 48px;
		}

		.tutorial-arrow-right {
			font-size: 36px;
		}
	}
</style>

<script>
	// @ts-nocheck
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let money = $state(0);
	let clickValue = $state(1);
	let incomePerSecond = $state(0);
	let totalEarned = $state(0);
	let totalClicks = $state(0);
	let totalUpgradesBought = $state(0);
	let bonusActive = $state(false);
	let frenzyActive = $state(false);
	let soundEnabled = $state(true);
	let wrinklersPopped = $state(0);
	let startTime = $state(Date.now());
	let offlineTime = $state(0);
	let prestigeLevel = $state(0);
	let prestigeBonus = $state(1);

	// UI State
	let showHelp = $state(false);

	// Neue Features
	let activeBoosts = $state([]);
	let currentEvent = $state(null);
	let eventTimeLeft = $state(0);
	let dailyRewardClaimed = $state(false);
	let lastLoginDate = $state(null);
	let marketMultiplier = $state(1.0);
	let marketTrend = $state('stable');
	let employees = $state([]);
	let research = $state([]);
	let miniGameActive = $state(false);
	let slotMachineSpinning = $state(false);
	let burgerFlipperActive = $state(false);
	let flipperScore = $state(0);
	let dailyChallenge = $state(null);
	let challengeProgress = $state(0);

	let intervals = [];

	const sounds = {
		click: browser
			? new Audio(
					'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG'
				)
			: null,
		buy: browser
			? new Audio(
					'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG'
				)
			: null
	};

	function playSound(s) {
		if (soundEnabled && sounds[s]) {
			try {
				sounds[s].currentTime = 0;
				sounds[s].play();
			} catch (e) {}
		}
	}

	const team = [
		{ id: 'janik', name: 'Janik', icon: '👑', role: 'CEO & Gründer', share: 0.5, class: 'ceo' },
		{ id: 'niklas', name: 'Niklas', icon: '⭐', role: 'Co-CEO', share: 0.4, class: 'co-ceo' },
		{
			id: 'christian',
			name: 'Christian',
			icon: '🤲',
			role: 'Bettler',
			share: 0.1,
			class: 'bettler'
		}
	];

	const upgrades = [
		{
			id: 'cursor',
			icon: '👆',
			name: 'Besserer Finger',
			baseIncome: 0,
			clickBonus: 1,
			baseCost: 10,
			multiplier: 1.15,
			owned: 0
		},
		{
			id: 'cursor2',
			icon: '✌️',
			name: 'Zwei Finger',
			baseIncome: 0,
			clickBonus: 5,
			baseCost: 100,
			multiplier: 1.2,
			owned: 0
		},
		{
			id: 'pet',
			icon: '🐕',
			name: 'Hund',
			baseIncome: 0,
			clickBonus: 15,
			baseCost: 500,
			multiplier: 1.25,
			owned: 0
		},
		{
			id: 'chef',
			icon: '👨‍🍳',
			name: 'Koch',
			baseIncome: 1,
			clickBonus: 0,
			baseCost: 50,
			multiplier: 1.15,
			owned: 0
		},
		{
			id: 'waiter',
			icon: '💁',
			name: 'Kellner',
			baseIncome: 8,
			clickBonus: 0,
			baseCost: 300,
			multiplier: 1.18,
			owned: 0
		},
		{
			id: 'oven',
			icon: '🔥',
			name: 'Profi-Grill',
			baseIncome: 40,
			clickBonus: 0,
			baseCost: 2000,
			multiplier: 1.22,
			owned: 0
		},
		{
			id: 'dishwasher',
			icon: '🍽️',
			name: 'Spülmaschine',
			baseIncome: 100,
			clickBonus: 0,
			baseCost: 8000,
			multiplier: 1.24,
			owned: 0
		},
		{
			id: 'foodtruck',
			icon: '🚚',
			name: 'Food Truck',
			baseIncome: 300,
			clickBonus: 0,
			baseCost: 30000,
			multiplier: 1.26,
			owned: 0
		},
		{
			id: 'restaurant',
			icon: '🏪',
			name: 'Restaurant',
			baseIncome: 1000,
			clickBonus: 0,
			baseCost: 100000,
			multiplier: 1.28,
			owned: 0
		},
		{
			id: 'chain',
			icon: '🏢',
			name: 'Restaurant-Kette',
			baseIncome: 5000,
			clickBonus: 0,
			baseCost: 500000,
			multiplier: 1.3,
			owned: 0
		},
		{
			id: 'franchise',
			icon: '🌎',
			name: 'Franchise',
			baseIncome: 20000,
			clickBonus: 0,
			baseCost: 2000000,
			multiplier: 1.32,
			owned: 0
		},
		{
			id: 'ai',
			icon: '🤖',
			name: 'KI Koch',
			baseIncome: 100000,
			clickBonus: 0,
			baseCost: 50000000,
			multiplier: 1.35,
			owned: 0
		},
		{
			id: 'space',
			icon: '🚀',
			name: 'Space Burger',
			baseIncome: 500000,
			clickBonus: 0,
			baseCost: 250000000,
			multiplier: 1.4,
			owned: 0
		},
		{
			id: 'nano',
			icon: '🧬',
			name: 'Nano-Tech',
			baseIncome: 0,
			clickBonus: 200000,
			baseCost: 20000000,
			multiplier: 1.45,
			owned: 0
		}
	];

	const achievements = [
		{ id: 'c10', label: '10 Klicks!', condition: () => totalClicks >= 10, shown: false },
		{ id: 'c100', label: '100 Klicks!', condition: () => totalClicks >= 100, shown: false },
		{ id: 'c1000', label: '1000 Klicks!', condition: () => totalClicks >= 1000, shown: false },
		{ id: 'c10000', label: '10.000 Klicks!', condition: () => totalClicks >= 10000, shown: false },
		{ id: 'b1k', label: '1.000 € verdient!', condition: () => totalEarned >= 1000, shown: false },
		{ id: 'b10k', label: '10.000 € verdient!', condition: () => totalEarned >= 10000, shown: false },
		{
			id: 'b100k',
			label: '100.000 € verdient!',
			condition: () => totalEarned >= 100000,
			shown: false
		},
		{
			id: 'b1m',
			label: '1 Million € verdient!',
			condition: () => totalEarned >= 1000000,
			shown: false
		},
		{
			id: 'b1b',
			label: '1 Milliarde € verdient!',
			condition: () => totalEarned >= 1000000000,
			shown: false
		},
		{
			id: 'u5',
			label: '5 Upgrades gekauft!',
			condition: () => totalUpgradesBought >= 5,
			shown: false
		},
		{
			id: 'u10',
			label: '10 Upgrades gekauft!',
			condition: () => totalUpgradesBought >= 10,
			shown: false
		},
		{
			id: 'u25',
			label: '25 Upgrades gekauft!',
			condition: () => totalUpgradesBought >= 25,
			shown: false
		},
		{
			id: 'u50',
			label: '50 Upgrades gekauft!',
			condition: () => totalUpgradesBought >= 50,
			shown: false
		},
		{
			id: 'fr',
			label: 'Franchise gekauft!',
			condition: () => upgrades.find((u) => u.id === 'franchise').owned > 0,
			shown: false
		},
		{
			id: 'all',
			label: 'Alle Upgrades gekauft!',
			condition: () => upgrades.every((u) => u.owned > 0),
			shown: false
		},
		{
			id: 'wrink',
			label: 'Ersten Wrinkler geplatzt!',
			condition: () => wrinklersPopped >= 1,
			shown: false
		},
		{
			id: 'prest1',
			label: 'Erstes Prestige erreicht!',
			condition: () => prestigeLevel >= 1,
			shown: false
		},
		{
			id: 'prest5',
			label: '5x Prestige erreicht!',
			condition: () => prestigeLevel >= 5,
			shown: false
		}
	];

	const newsMessages = [
		'🍔 Breaking: Lokaler Burger wird zum Millionär!',
		'📰 Burger-Industrie boomt wie nie zuvor!',
		'🚀 Wissenschaftler entwickeln Space-Burger!',
		'🤖 KI übernimmt Fast-Food-Branche!',
		'👑 CEO verdient sich goldene Nase!',
		'💰 Burger-Klicker bricht alle Rekorde!',
		'🔥 Neuer Grill stellt Weltrekord auf!',
		'🌎 Franchise expandiert weltweit!',
		'🐕 Hund wird bester Mitarbeiter des Monats!',
		'✌️ Zwei-Finger-Technik revolutioniert Klick-Welt!',
		'⭐ Prestige-System sorgt für Aufruhr!',
		'🎯 Spieler knackt Milliardenmarke!'
	];

	// Boost System
	const boostTypes = [
		{ id: 'frenzy', name: '🔥 Frenzy', multiplier: 7, duration: 30, cost: 5000 },
		{ id: 'mega', name: '⚡ Mega Boost', multiplier: 15, duration: 15, cost: 15000 },
		{ id: 'golden', name: '✨ Golden Hour', multiplier: 3, duration: 60, cost: 8000 },
		{ id: 'auto', name: '🤖 Auto-Clicker', multiplier: 1, duration: 45, cost: 12000 }
	];

	// Random Events
	const randomEvents = [
		{ id: 'rush', name: '🏃 Rush Hour', effect: 'income', multiplier: 2, duration: 45 },
		{ id: 'sale', name: '💰 Flash Sale', effect: 'click', multiplier: 3, duration: 30 },
		{ id: 'festival', name: '🎉 Food Festival', effect: 'both', multiplier: 1.5, duration: 60 },
		{ id: 'critic', name: '👨‍🍳 Food Critic', effect: 'challenge', requirement: 'clicks', target: 100 },
		{ id: 'health', name: '🏥 Health Inspector', effect: 'penalty', multiplier: 0.5, duration: 20 }
	];

	// Employee/Team System
	const employeeTypes = [
		{ id: 'cook', name: '👨‍🍳 Koch', bonus: 'income', value: 0.1, cost: 50000, hired: 0, max: 10 },
		{ id: 'cashier', name: '💵 Kassierer', bonus: 'click', value: 5, cost: 75000, hired: 0, max: 5 },
		{ id: 'manager', name: '👔 Manager', bonus: 'efficiency', value: 0.05, cost: 150000, hired: 0, max: 3 },
		{ id: 'marketer', name: '📱 Marketer', bonus: 'events', value: 0.2, cost: 100000, hired: 0, max: 5 }
	];

	// Research/Tech Tree
	const researchOptions = [
		{ id: 'efficiency1', name: '⚡ Effizienz I', bonus: 'income', value: 0.1, cost: 100000, researched: false, requires: [] },
		{ id: 'efficiency2', name: '⚡ Effizienz II', bonus: 'income', value: 0.2, cost: 500000, researched: false, requires: ['efficiency1'] },
		{ id: 'marketing1', name: '📊 Marketing I', bonus: 'click', value: 10, cost: 200000, researched: false, requires: [] },
		{ id: 'marketing2', name: '📊 Marketing II', bonus: 'click', value: 25, cost: 750000, researched: false, requires: ['marketing1'] },
		{ id: 'automation', name: '🤖 Automation', bonus: 'passive', value: 0.15, cost: 1000000, researched: false, requires: ['efficiency1'] },
		{ id: 'premium', name: '⭐ Premium Zutaten', bonus: 'quality', value: 0.25, cost: 2000000, researched: false, requires: ['marketing1'] }
	];

	// Daily Challenges
	const challengeTypes = [
		{ id: 'clicks', name: 'Klick-Meister', desc: 'Erreiche {target} Klicks', reward: 50000 },
		{ id: 'income', name: 'Geld-Magnet', desc: 'Verdiene {target}€', reward: 75000 },
		{ id: 'upgrades', name: 'Shopping-Spree', desc: 'Kaufe {target} Upgrades', reward: 100000 },
		{ id: 'noclick', name: 'Passiv-Pro', desc: 'Verdiene {target}€ ohne zu klicken', reward: 150000 }
	];

	function updateNewsTicker() {
		if (!browser) return;
		const ticker = document.getElementById('newsTicker');
		if (ticker) {
			ticker.textContent = newsMessages[Math.floor(Math.random() * newsMessages.length)];
		}
	}

	function calculatePrestigePoints() {
		return Math.floor(Math.pow(totalEarned / 1000000, 0.5));
	}

	function showPrestigeModal() {
		if (totalEarned < 1000000) {
			showAchievement('⚠️ Du benötigst mindestens 1 Million €!');
			return;
		}
		const pts = document.getElementById('prestigePoints');
		if (pts) pts.textContent = calculatePrestigePoints() + ' Prestige-Punkte';
		const modal = document.getElementById('prestigeModal');
		if (modal) modal.style.display = 'flex';
	}

	function hidePrestigeModal() {
		if (!browser) return;
		const modal = document.getElementById('prestigeModal');
		if (modal) modal.style.display = 'none';
	}

	function doPrestige() {
		const pts = calculatePrestigePoints();
		if (pts <= 0) {
			showAchievement('⚠️ Nicht genug für Prestige!');
			return;
		}
		prestigeLevel += pts;
		prestigeBonus = 1 + prestigeLevel * 0.05;
		money = 0;
		totalEarned = 0;
		totalClicks = 0;
		totalUpgradesBought = 0;
		clickValue = 1;
		incomePerSecond = 0;
		upgrades.forEach((u) => (u.owned = 0));
		calculateIncome();
		renderUpgrades();
		updateDisplay();
		updateDistribution();
		updatePrestigeDisplay();
		hidePrestigeModal();
		showAchievement(`⭐ Prestige! +${pts} Punkte! Neuer Bonus: +${(prestigeBonus - 1) * 100}%`);
		checkAchievements();
		saveGame();
	}

	function getCost(u) {
		return Math.floor(u.baseCost * Math.pow(u.multiplier, u.owned));
	}

	function calculateIncome() {
		clickValue = 1;
		incomePerSecond = 0;
		upgrades.forEach((u) => {
			clickValue += u.clickBonus * u.owned;
			incomePerSecond += u.baseIncome * u.owned;
		});
		
		// Apply prestige bonus
		clickValue = Math.floor(clickValue * prestigeBonus);
		incomePerSecond = Math.floor(incomePerSecond * prestigeBonus);
		
		// Apply employee bonuses
		const empBonus = getEmployeeBonus();
		incomePerSecond = Math.floor(incomePerSecond * empBonus.incomeBonus);
		clickValue += empBonus.clickBonus;
		
		// Apply research bonuses
		const resBonus = getResearchBonus();
		incomePerSecond = Math.floor(incomePerSecond * resBonus.incomeBonus);
		clickValue += resBonus.clickBonus;
		
		// Apply market multiplier
		incomePerSecond = Math.floor(incomePerSecond * marketMultiplier);
		clickValue = Math.floor(clickValue * marketMultiplier);
		
		// Apply active boosts
		const boostMult = updateBoosts();
		incomePerSecond = Math.floor(incomePerSecond * boostMult);
		clickValue = Math.floor(clickValue * boostMult);
		
		// Apply event multiplier
		const eventMult = updateEvent();
		if (currentEvent) {
			if (currentEvent.effect === 'income' || currentEvent.effect === 'both') {
				incomePerSecond = Math.floor(incomePerSecond * eventMult);
			}
			if (currentEvent.effect === 'click' || currentEvent.effect === 'both') {
				clickValue = Math.floor(clickValue * eventMult);
			}
		}
	}

	function buyUpgrade(id) {
		const u = upgrades.find((x) => x.id === id);
		const c = getCost(u);
		if (money >= c) {
			money -= c;
			u.owned++;
			totalUpgradesBought++;
			calculateIncome();
			updateDisplay();
			saveGame();
			checkAchievements();
			playSound('buy');
		}
	}

	function handleClick(e) {
		money += clickValue;
		totalEarned += clickValue;
		totalClicks++;
		checkAchievements();
		playSound('click');
		if (browser) {
			const ef = document.createElement('div');
			ef.className = 'click-effect';
			ef.textContent = '+' + clickValue + '€';
			ef.style.left = e.clientX + 'px';
			ef.style.top = e.clientY + 'px';
			document.body.appendChild(ef);
			setTimeout(() => ef.remove(), 1200);
		}
	}

	function formatNumber(n) {
		if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
		if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
		if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
		return Math.floor(n).toLocaleString('de-DE');
	}

	function formatTime(ms) {
		const s = Math.floor(ms / 1000);
		const h = Math.floor(s / 3600);
		const m = Math.floor((s % 3600) / 60);
		const sec = s % 60;
		return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
	}

	// updateDisplay and updateDistribution are now handled by Svelte reactivity
	// No need for manual DOM manipulation
	
	// Stub functions for compatibility (reactivity handles updates automatically)
	function updateDisplay() {
		// UI updates handled by Svelte reactivity
	}
	
	function updateDistribution() {
		// UI updates handled by Svelte reactivity
	}
	
	function renderUpgrades() {
		// UI updates handled by Svelte reactivity
	}

	function updatePrestigeDisplay() {
		// UI updates handled by Svelte reactivity
	}

	// ===== NEUE FEATURES =====
	
	// Boost System
	function activateBoost(boostId) {
		const boost = boostTypes.find(b => b.id === boostId);
		if (!boost || money < boost.cost) return;
		
		money -= boost.cost;
		activeBoosts.push({
			...boost,
			endTime: Date.now() + boost.duration * 1000
		});
		
		showAchievement(`${boost.name} aktiviert für ${boost.duration}s!`);
		playSound('buy');
	}

	function updateBoosts() {
		const now = Date.now();
		activeBoosts = activeBoosts.filter(b => b.endTime > now);
		
		// Berechne aktuellen Boost-Multiplikator
		let totalMultiplier = 1;
		activeBoosts.forEach(b => {
			totalMultiplier *= b.multiplier;
		});
		return totalMultiplier;
	}

	// Random Events
	function triggerRandomEvent() {
		if (currentEvent || Math.random() > 0.1) return; // 10% Chance
		
		const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
		currentEvent = { ...event };
		eventTimeLeft = event.duration || 30;
		
		showAchievement(`🎉 Event: ${event.name}!`);
	}

	function updateEvent() {
		if (!currentEvent) return 1;
		
		eventTimeLeft--;
		if (eventTimeLeft <= 0) {
			currentEvent = null;
			return 1;
		}
		
		if (currentEvent.effect === 'income') return currentEvent.multiplier;
		if (currentEvent.effect === 'click') return currentEvent.multiplier;
		if (currentEvent.effect === 'both') return currentEvent.multiplier;
		if (currentEvent.effect === 'penalty') return currentEvent.multiplier;
		
		return 1;
	}

	// Employee System
	function hireEmployee(employeeId) {
		const emp = employeeTypes.find(e => e.id === employeeId);
		if (!emp || money < emp.cost || emp.hired >= emp.max) return;
		
		money -= emp.cost;
		emp.hired++;
		employees.push({ ...emp, id: `${emp.id}_${emp.hired}` });
		
		showAchievement(`${emp.name} eingestellt!`);
		playSound('buy');
		calculateIncome();
	}

	function getEmployeeBonus() {
		let incomeBonus = 1;
		let clickBonus = 0;
		
		employeeTypes.forEach(emp => {
			if (emp.bonus === 'income') incomeBonus += emp.hired * emp.value;
			if (emp.bonus === 'click') clickBonus += emp.hired * emp.value;
		});
		
		return { incomeBonus, clickBonus };
	}

	// Research System
	function doResearch(researchId) {
		const r = researchOptions.find(opt => opt.id === researchId);
		if (!r || r.researched || money < r.cost) return;
		
		// Check requirements
		const reqsMet = r.requires.every(reqId => {
			const req = researchOptions.find(o => o.id === reqId);
			return req && req.researched;
		});
		
		if (!reqsMet) {
			showAchievement('⚠️ Voraussetzungen nicht erfüllt!');
			return;
		}
		
		money -= r.cost;
		r.researched = true;
		research.push(researchId);
		
		showAchievement(`🔬 ${r.name} erforscht!`);
		playSound('buy');
		calculateIncome();
	}

	function getResearchBonus() {
		let incomeBonus = 1;
		let clickBonus = 0;
		
		researchOptions.forEach(r => {
			if (r.researched) {
				if (r.bonus === 'income') incomeBonus += r.value;
				if (r.bonus === 'click') clickBonus += r.value;
				if (r.bonus === 'passive') incomeBonus += r.value;
			}
		});
		
		return { incomeBonus, clickBonus };
	}

	// Market System
	function updateMarket() {
		const rand = Math.random();
		
		if (rand < 0.1) { // 10% Boom
			marketMultiplier = 1.5 + Math.random() * 0.5;
			marketTrend = 'up';
		} else if (rand > 0.9) { // 10% Crash
			marketMultiplier = 0.5 + Math.random() * 0.3;
			marketTrend = 'down';
		} else { // 80% Stable
			marketMultiplier = 0.9 + Math.random() * 0.2;
			marketTrend = 'stable';
		}
	}

	// Daily Rewards
	function checkDailyReward() {
		if (!browser) return;
		const today = new Date().toDateString();
		
		if (lastLoginDate !== today) {
			lastLoginDate = today;
			dailyRewardClaimed = false;
		}
	}

	function claimDailyReward() {
		if (dailyRewardClaimed) return;
		
		const reward = Math.floor(incomePerSecond * 600); // 10 Minuten Income
		money += reward;
		totalEarned += reward;
		dailyRewardClaimed = true;
		
		showAchievement(`🎁 Tägliche Belohnung: ${formatNumber(reward)}€!`);
		playSound('buy');
	}

	// Daily Challenge
	function generateDailyChallenge() {
		if (!browser) return;
		const today = new Date().toDateString();
		const stored = localStorage.getItem('dailyChallenge');
		
		if (stored) {
			const saved = JSON.parse(stored);
			if (saved.date === today) {
				dailyChallenge = saved.challenge;
				challengeProgress = saved.progress || 0;
				return;
			}
		}
		
		const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
		const target = type.id === 'clicks' ? 500 + Math.floor(Math.random() * 500) :
					  type.id === 'income' ? 50000 + Math.floor(Math.random() * 100000) :
					  type.id === 'upgrades' ? 5 + Math.floor(Math.random() * 10) :
					  type.id === 'noclick' ? 10000 + Math.floor(Math.random() * 20000) : 100;
		
		dailyChallenge = {
			...type,
			target,
			date: today,
			desc: type.desc.replace('{target}', formatNumber(target))
		};
		challengeProgress = 0;
		
		localStorage.setItem('dailyChallenge', JSON.stringify({
			date: today,
			challenge: dailyChallenge,
			progress: 0
		}));
	}

	function updateChallengeProgress() {
		if (!dailyChallenge) return;
		
		if (dailyChallenge.id === 'clicks') {
			challengeProgress = totalClicks;
		} else if (dailyChallenge.id === 'income') {
			challengeProgress = totalEarned;
		} else if (dailyChallenge.id === 'upgrades') {
			challengeProgress = totalUpgradesBought;
		}
		
		if (challengeProgress >= dailyChallenge.target) {
			money += dailyChallenge.reward;
			showAchievement(`✅ Challenge abgeschlossen! +${formatNumber(dailyChallenge.reward)}€`);
			dailyChallenge = null;
		}
	}

	// Mini-Games
	function startSlotMachine() {
		if (money < 1000) {
			showAchievement('⚠️ Benötigt 1.000€!');
			return;
		}
		
		money -= 1000;
		slotMachineSpinning = true;
		
		setTimeout(() => {
			const symbols = ['🍔', '💰', '⭐', '🍟', '🥤'];
			const result = [
				symbols[Math.floor(Math.random() * symbols.length)],
				symbols[Math.floor(Math.random() * symbols.length)],
				symbols[Math.floor(Math.random() * symbols.length)]
			];
			
			if (result[0] === result[1] && result[1] === result[2]) {
				const win = result[0] === '💰' ? 50000 : result[0] === '⭐' ? 25000 : 10000;
				money += win;
				showAchievement(`🎰 JACKPOT! ${result.join(' ')} +${formatNumber(win)}€!`);
			} else if (result[0] === result[1] || result[1] === result[2]) {
				money += 2000;
				showAchievement(`🎰 ${result.join(' ')} +2.000€`);
			} else {
				showAchievement(`🎰 ${result.join(' ')} Leider verloren!`);
			}
			
			slotMachineSpinning = false;
		}, 2000);
	}

	function startBurgerFlipper() {
		burgerFlipperActive = true;
		flipperScore = 0;
		
		let count = 0;
		const interval = setInterval(() => {
			count++;
			if (count >= 10) {
				clearInterval(interval);
				burgerFlipperActive = false;
				const reward = flipperScore * 1000;
				money += reward;
				showAchievement(`🍔 Flipper beendet! ${flipperScore} Burger = ${formatNumber(reward)}€`);
			}
		}, 1000);
	}

	function flipBurger() {
		if (!burgerFlipperActive) return;
		flipperScore++;
		playSound('click');
	}

	// ===== END NEUE FEATURES =====

	function saveGame() {
		if (!browser) return;
		const s = {
			money,
			totalEarned,
			totalClicks,
			totalUpgradesBought,
			wrinklersPopped,
			prestigeLevel,
			startTime,
			upgrades: upgrades.map((u) => ({ id: u.id, owned: u.owned })),
			achievements: achievements.map((a) => a.shown),
			lastSave: Date.now(),
			// Neue Features
			lastLoginDate,
			dailyRewardClaimed,
			marketMultiplier,
			marketTrend,
			employees: employeeTypes.map(e => ({ id: e.id, hired: e.hired })),
			research: researchOptions.map(r => ({ id: r.id, researched: r.researched }))
		};
		localStorage.setItem('burgerClickerSave', JSON.stringify(s));
	}

	function loadGame() {
		if (!browser) return;
		const s = localStorage.getItem('burgerClickerSave');
		if (s) {
			const d = JSON.parse(s);
			money = d.money || 0;
			totalEarned = d.totalEarned || 0;
			totalClicks = d.totalClicks || 0;
			totalUpgradesBought = d.totalUpgradesBought || 0;
			wrinklersPopped = d.wrinklersPopped || 0;
			prestigeLevel = d.prestigeLevel || 0;
			prestigeBonus = 1 + prestigeLevel * 0.05;
			startTime = d.startTime || Date.now();
			
			// Load upgrades
			if (d.upgrades)
				d.upgrades.forEach((su) => {
					const u = upgrades.find((x) => x.id === su.id);
					if (u) u.owned = su.owned;
				});
			
			// Load achievements
			if (Array.isArray(d.achievements))
				d.achievements.forEach((v, i) => {
					if (achievements[i]) achievements[i].shown = v;
				});
			
			// Load new features
			if (d.lastLoginDate) lastLoginDate = d.lastLoginDate;
			if (d.dailyRewardClaimed !== undefined) dailyRewardClaimed = d.dailyRewardClaimed;
			if (d.marketMultiplier) marketMultiplier = d.marketMultiplier;
			if (d.marketTrend) marketTrend = d.marketTrend;
			
			// Load employees
			if (d.employees) {
				d.employees.forEach(e => {
					const emp = employeeTypes.find(t => t.id === e.id);
					if (emp) emp.hired = e.hired;
				});
			}
			
			// Load research
			if (d.research) {
				d.research.forEach(r => {
					const res = researchOptions.find(o => o.id === r.id);
					if (res) res.researched = r.researched;
				});
			}
			
			// Offline earnings
			if (d.lastSave) {
				offlineTime = Date.now() - d.lastSave;
				const offlineEarnings = Math.min(
					incomePerSecond * (offlineTime / 1000),
					incomePerSecond * 3600 * 24
				);
				if (offlineEarnings > 0) {
					money += offlineEarnings;
					totalEarned += offlineEarnings;
					showAchievement(`💤 Offline-Einkommen: ${formatNumber(offlineEarnings)} €`);
				}
			}
			
			calculateIncome();
			updateDisplay();
			updatePrestigeDisplay();
		}
	}

	function resetGame() {
		if (browser && confirm('Möchtest du wirklich alle Fortschritte zurücksetzen?')) {
			money = 0;
			totalEarned = 0;
			totalClicks = 0;
			totalUpgradesBought = 0;
			clickValue = 1;
			incomePerSecond = 0;
			wrinklersPopped = 0;
			prestigeLevel = 0;
			prestigeBonus = 1;
			startTime = Date.now();
			upgrades.forEach((u) => (u.owned = 0));
			achievements.forEach((a) => (a.shown = false));
			localStorage.removeItem('burgerClickerSave');
			calculateIncome();
			renderUpgrades();
			updateDisplay();
			updateDistribution();
			updatePrestigeDisplay();
		}
	}

	function showAchievement(t) {
		if (!browser) return;
		const e = document.createElement('div');
		e.className = 'achievement-popup';
		e.textContent = t;
		document.body.appendChild(e);
		setTimeout(() => e.remove(), 3800);
	}

	function showAchievementsModal() {
		if (!browser) return;
		const m = document.getElementById('achievModal');
		const l = document.getElementById('achievList');
		if (l) {
			l.innerHTML = '';
			achievements.forEach((a) => {
				const li = document.createElement('li');
				li.textContent = a.label;
				li.className = a.shown ? 'complete' : 'incomplete';
				l.appendChild(li);
			});
		}
		if (m) m.style.display = 'flex';
	}

	function hideAchievementsModal() {
		if (!browser) return;
		const modal = document.getElementById('achievModal');
		if (modal) modal.style.display = 'none';
	}

	function showStatsModal() {
		if (!browser) return;
		const playTimeEl = document.getElementById('playTime');
		const statsClicksEl = document.getElementById('statsClicks');
		const statsBurgerValueEl = document.getElementById('statsBurgerValue');
		const statsPerSecEl = document.getElementById('statsPerSec');
		const statsPrestigeEl = document.getElementById('statsPrestige');
		const statsPrestigeBonusEl = document.getElementById('statsPrestigeBonus');
		const statsAchievEl = document.getElementById('statsAchiev');
		const statsWrinklersEl = document.getElementById('statsWrinklers');

		if (playTimeEl) playTimeEl.textContent = formatTime(Date.now() - startTime);
		if (statsClicksEl) statsClicksEl.textContent = totalClicks.toLocaleString('de-DE');
		if (statsBurgerValueEl) statsBurgerValueEl.textContent = formatNumber(clickValue) + ' €';
		if (statsPerSecEl) statsPerSecEl.textContent = formatNumber(incomePerSecond) + ' €';
		if (statsPrestigeEl) statsPrestigeEl.textContent = prestigeLevel;
		if (statsPrestigeBonusEl) statsPrestigeBonusEl.textContent = '+' + prestigeLevel * 5 + '%';
		if (statsAchievEl)
			statsAchievEl.textContent =
				achievements.filter((a) => a.shown).length + '/' + achievements.length;
		if (statsWrinklersEl) statsWrinklersEl.textContent = wrinklersPopped;

		const modal = document.getElementById('statsModal');
		if (modal) modal.style.display = 'flex';
	}

	function hideStatsModal() {
		if (!browser) return;
		const modal = document.getElementById('statsModal');
		if (modal) modal.style.display = 'none';
	}

	function checkAchievements() {
		achievements.forEach((a) => {
			if (a.condition() && !a.shown) {
				a.shown = true;
				showAchievement(a.label);
			}
		});
	}

	function spawnGoldenBurger() {
		if (bonusActive || !browser) return;
		const g = document.getElementById('goldenBurger');
		if (g) {
			g.style.display = 'block';
			setTimeout(() => (g.style.display = 'none'), 8000);
		}
	}

	function activateFrenzy() {
		if (frenzyActive || bonusActive || !browser) return;
		if (Math.random() < 0.15) {
			frenzyActive = true;
			const oldInc = incomePerSecond,
				oldClick = clickValue;
			incomePerSecond *= 3;
			clickValue *= 3;
			showAchievement('🔥 FRENZY MODE! x3 für 20 Sek!');
			setTimeout(() => {
				incomePerSecond = oldInc;
				clickValue = oldClick;
				frenzyActive = false;
				calculateIncome();
				updateDisplay();
			}, 20000);
		}
	}

	function spawnWrinkler() {
		if (!browser) return;
		if (Math.random() < 0.3 && document.querySelectorAll('.wrinkler').length < 3) {
			const w = document.createElement('div');
			w.className = 'wrinkler';
			w.textContent = '👾';
			w.style.top = Math.random() * 200 + 'px';
			w.style.left = Math.random() * 200 + 'px';
			w.onclick = function () {
				this.remove();
				const bonus = incomePerSecond * 10;
				money += bonus;
				totalEarned += bonus;
				wrinklersPopped++;
				showAchievement(`👾 Wrinkler geplatzt! +${formatNumber(bonus)} €`);
				checkAchievements();
			};
			const clickerArea = document.getElementById('clickerArea');
			if (clickerArea) clickerArea.appendChild(w);
		}
	}

	onMount(() => {
		loadGame();
		renderUpgrades();
		updateDistribution();
		calculateIncome();
		updateDisplay();
		updatePrestigeDisplay();

		// Show welcome message for new players
		const isFirstVisit = !localStorage.getItem('burgerClickerSave');
		if (isFirstVisit) {
			setTimeout(() => {
				showHelp = true;
				showAchievement('👋 Willkommen! Drücke H für Hilfe!');
			}, 1000);
		}

		const burgerBtn = document.getElementById('burgerBtn');
		if (burgerBtn) {
			burgerBtn.addEventListener('click', handleClick);
		}

		// Keyboard Shortcuts
		const handleKeyPress = (e) => {
			if (e.key === 'h' || e.key === 'H' || e.key === '?') {
				showHelp = !showHelp;
			}
			if (e.key === 'Escape') {
				showHelp = false;
			}
			if (e.key === ' ' || e.key === 'Enter') {
				// Spacebar or Enter to click burger
				const burger = document.getElementById('burgerBtn');
				if (burger && !showHelp) {
					e.preventDefault();
					burger.click();
				}
			}
		};
		
		document.addEventListener('keydown', handleKeyPress);

		const soundToggle = document.getElementById('soundToggle');
		if (soundToggle) {
			soundToggle.onclick = () => {
				soundEnabled = !soundEnabled;
				soundToggle.textContent = soundEnabled ? '🔊 Sound An' : '🔇 Sound Aus';
			};
		}

		const goldenBurger = document.getElementById('goldenBurger');
		if (goldenBurger) {
			goldenBurger.onclick = function () {
				this.style.display = 'none';
				bonusActive = true;
				const oldInc = incomePerSecond,
					oldClick = clickValue;
				incomePerSecond *= 7;
				clickValue *= 7;
				showAchievement('🌟 Golden Burger! x7 für 15 Sek!');
				setTimeout(() => {
					incomePerSecond = oldInc;
					clickValue = oldClick;
					bonusActive = false;
					calculateIncome();
					updateDisplay();
				}, 15000);
			};
		}

		// Make functions globally available
		if (browser) {
			window.showAchievementsModal = showAchievementsModal;
			window.hideAchievementsModal = hideAchievementsModal;
			window.showStatsModal = showStatsModal;
			window.hideStatsModal = hideStatsModal;
			window.showPrestigeModal = showPrestigeModal;
			window.hidePrestigeModal = hidePrestigeModal;
			window.doPrestige = doPrestige;
			window.resetGame = resetGame;
		}

		// Income generation
		intervals.push(
			setInterval(() => {
				const i = incomePerSecond / 10;
				money += i;
				totalEarned += i;
				updateDisplay();
			}, 100)
		);

		// Render counter
		let renderCounter = 0;
		intervals.push(
			setInterval(() => {
				renderCounter++;
				if (renderCounter % 5 === 0) {
					updateDistribution();
					renderUpgrades();
				}
			}, 100)
		);

		// Save game
		intervals.push(setInterval(saveGame, 5000));

		// News ticker
		intervals.push(setInterval(updateNewsTicker, 15000));

		// Golden burger spawn
		intervals.push(setInterval(spawnGoldenBurger, 90000));

		// Frenzy activation
		intervals.push(setInterval(activateFrenzy, 120000));

		// Wrinkler spawn
		intervals.push(setInterval(spawnWrinkler, 60000));

		// Neue Feature Intervals
		checkDailyReward();
		generateDailyChallenge();
		
		// Update boosts every second
		intervals.push(setInterval(() => {
			updateBoosts();
			updateEvent();
			updateChallengeProgress();
		}, 1000));

		// Random events (every 3 minutes check)
		intervals.push(setInterval(triggerRandomEvent, 180000));

		// Market updates (every 2 minutes)
		intervals.push(setInterval(updateMarket, 120000));
		updateMarket(); // Initial market state
	});

	onDestroy(() => {
		intervals.forEach((interval) => clearInterval(interval));
	});
</script>

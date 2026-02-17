import { CharacterTypeEnum } from '../enums/character-type.enum';
import { CharacterRangeEnum } from '../enums/character-range.enum';
import { CharacterSizeEnum } from '../enums/character-size.enum';

/** Lança 1 dado de `sides` lados (1dX). */
function rollD(sides: number): number {
	return Math.floor(Math.random() * sides) + 1;
}

export class CharacterDto {
	id: string;
	name: string;
	currentHp: number;
	hp: number;
	movement: 6 | 9 | 12;
	size: CharacterSizeEnum;
	range: CharacterRangeEnum;
	type: CharacterTypeEnum;

	/** Base do dano (padrão 10). Dano final = damageBase + 1d12 (dano) | 1d8 (tank) | 1d4 (suporte). */
	private damageBase: number = 10;

	/** Base da cura (padrão 10). Cura final = healingBase + 1d6. */
	private healingBase: number = 10;

	/** Lados do dado de dano por tipo: dano=12, tank=8, suporte=4. */
	getDamageDieSides(): number {
		switch (this.type) {
			case CharacterTypeEnum.DAMAGE:
				return 12;
			case CharacterTypeEnum.TANK:
				return 8;
			case CharacterTypeEnum.SUPPORT:
				return 4;
			default:
				return 4;
		}
	}

	/** Rolagem de dano: damageBase + 1d[tipo]. */
	rollDamage(): number {
		return this.damageBase + rollD(this.getDamageDieSides());
	}

	/** Rolagem de cura: healingBase + 1d6. */
	rollHealing(): number {
		return this.healingBase + rollD(6);
	}
}
import { builder } from '../builder';
import { db } from '../db';
import { parseID } from '../utils';

builder.prismaNode('Point', {
  findUnique: (id) => ({ id: parseID(id) }),
  id: {
    resolve: ({ id }) => id,
  },
  fields: (t) => ({
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    scored: t.exposeBoolean('scored'),
    startedOnOffense: t.exposeBoolean('startedOnOffense'),
    players: t.relation('players'),
    game: t.relation('game'),
    team: t.relation('team'),
  }),
});

export const AddPointInput = builder.inputType('CreatePointInput', {
  fields: (t) => ({
    gameId: t.id({ required: true }),
    scored: t.boolean({ required: false, defaultValue: false }),
    startedOnOffense: t.boolean({ required: true }),
    order: t.field({
      defaultValue: 'ASC',
      type: builder.enumType('Sort', {
        values: ['ASC', 'DESC'] as const,
      }),
    }),
    playerIds: t.idList({ required: true }),
  }),
});

builder.mutationField('addPoint', (t) =>
  t.prismaField({
    type: 'Point',
    nullable: true,
    args: {
      input: t.arg({ type: AddPointInput, required: false, defaultValue: {} }),
    },
    resolve: async (query, _, { input }) => {
      const game = await db.game.findUniqueOrThrow({ where: { id: parseID(input.gameId) } });

      return db.point.create({
        data: {
          scored: input.scored,
          startedOnOffense: input.startedOnOffense,
          players: {
            connect: input.playerIds.map((id) => ({ id: parseID(id) })),
          },
          game: {
            connect: { id: game.id },
          },
          team: {
            connect: { id: game.teamId },
          },
        },
      });
    },
  }),
);

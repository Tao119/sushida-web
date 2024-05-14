import random


class Member:
    def __init__(self, name, level, preference=None):
        self.name = name
        self.level = level
        self.preference = preference if preference else set()


class PairGenerator:
    def __init__(self, members):
        self.members = members
        self.recent_pairs = set()

    def generate_pair(self):
        available_pairs = [
            pair for pair in self._get_all_pairs() if pair not in self.recent_pairs]

        if not available_pairs:
            print("すべてのペアが直近でのペアとなっています。")
            return None

        selected_pair = random.choice(available_pairs)
        self.recent_pairs.add(selected_pair)
        return selected_pair

    def _get_all_pairs(self):
        return [(member1, member2) for member1 in self.members for member2 in self.members if member1 != member2]

    def _level_difference(self, pair):
        # ペアのレベル差を計算する関数
        return abs(int(pair[0].level) - int(pair[1].level))

    def _satisfies_preference(self, pair):
        # ペアが希望条件を満たすかどうかを判定する関数
        return pair[0].name in pair[1].preference or pair[1].name in pair[0].preference


# 会員リストを作成 (仮のデータ)
members_data = [{"name": f"Member{i}", "level": str(
    random.randint(1, 5)), "preference": set()} for i in range(30)]

# 一部のメンバーに希望を追加 (仮のデータ)
for member in members_data[:10]:
    member["preference"] = {f"Member{j}" for j in random.sample(range(30), 3)}

members = [Member(**data) for data in members_data]

# ペア生成器を初期化
pair_generator = PairGenerator(members)

# 複数のペアを生成
generated_pairs = [pair_generator.generate_pair() for _ in range(15)]

for pair in generated_pairs:
    print("生成されたペア:", [(member.name, member.level) for member in pair])

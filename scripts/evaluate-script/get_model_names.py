models = set()

with open("forecasts_filenames.txt") as f:
    for filename in f:
        model = filename[:filename.find("_state_death")].strip() + "\n"
        models.add(model)

with open("models.txt", "w") as f:
    f.writelines(models)
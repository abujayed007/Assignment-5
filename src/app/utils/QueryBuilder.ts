import { Query } from "mongoose";
import { excludeField } from "./constant";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }
    if (filter.balance) {
      this.modelQuery = this.modelQuery.find({
        balance: Number(filter.balance),
      });
      delete filter.balance;
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  // search(searchableFields: string[]): this {
  //   const searchTerm = this.query.searchTerm || "";
  //   if (!searchTerm) return this;

  //   const isNumber = !isNaN(Number(searchTerm));
  //   const searchQuery = {
  //     $or: searchableFields.map((field) => {
  //       // Only cast to number if field is numeric AND searchTerm is a number
  //       if (field === "balance" && isNumber) {
  //         return { [field]: Number(searchTerm) };
  //       }
  //       // Otherwise use regex for strings (case-sensitive)
  //       return { [field]: { $regex: searchTerm, $options: "i" } };
  //     }),
  //   };

  //   this.modelQuery = this.modelQuery.find(searchQuery);
  //   return this;
  // }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm || "";
    if (!searchTerm) return this;

    const isNumber = !isNaN(Number(searchTerm));

    const searchQuery = {
      $or: searchableFields
        .filter((field) => !(field === "balance" && !isNumber)) // skip balance if not numeric
        .map((field) => {
          if (field === "balance") {
            return { [field]: Number(searchTerm) }; // numeric match
          }
          return { [field]: { $regex: searchTerm, $options: "i" } }; // string fields (type, status, phone)
        }),
    };

    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
